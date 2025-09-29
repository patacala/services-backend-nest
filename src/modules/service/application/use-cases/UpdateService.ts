import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateServiceDto } from '../../infrastructure/dtos/service.dto';
import { MediaKind, MediaProvider, MediaVariant } from '@prisma/client';

@Injectable()
export class UpdateServiceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  private getVariantFromUrl(url: string): MediaVariant {
    const segments = url.split('/');
    const lastSegment = segments.pop() || '';

    if (Object.values(MediaVariant).includes(lastSegment as MediaVariant)) {
      return lastSegment as MediaVariant;
    }

    return MediaVariant.public;
  }

  async execute(userId: string, serviceId: string, dto: UpdateServiceDto) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const serviceToUpdate = await tx.service.findUnique({
          where: { id: serviceId, user_id: userId },
        });

        if (!serviceToUpdate) {
          throw new NotFoundException('Service not found.');
        }

        if (dto.categoryIds) {
          await tx.serviceCategory.deleteMany({ where: { service_id: serviceId } });
          await tx.serviceCategory.createMany({
            data: dto.categoryIds.map((categoryId) => ({
              service_id: serviceId,
              category_id: BigInt(categoryId),
            })),
          });
        }

        if (dto.media && serviceToUpdate.media_link_id) {
          const incomingIds = dto.media.map((m) => m.id);

          const existingMedia = await tx.mediaFile.findMany({
            where: { link_id: serviceToUpdate.media_link_id },
          });

          const mediaOperations = [];
          const toDelete = existingMedia.filter(
            (m) => !incomingIds.includes(m.provider_ref)
          );
          if (toDelete.length > 0) {
            const deleteOp = tx.mediaFile.deleteMany({
              where: { id: { in: toDelete.map((m) => m.id) } },
            });
            mediaOperations.push(deleteOp);
          }

          for (const [index, incomingMedia] of dto.media.entries()) {
            const position = index;

            if (incomingMedia.downloaded === true) {
              const updateOp = tx.mediaFile.updateMany({
                where: {
                  provider_ref: incomingMedia.id,
                  link_id: serviceToUpdate.media_link_id,
                },
                data: { position },
              });
              mediaOperations.push(updateOp);
            } else {
              const deleteOp = tx.mediaFile.deleteMany({
                where: {
                  link_id: serviceToUpdate.media_link_id,
                  position,
                },
              });
              mediaOperations.push(deleteOp);

              let newFilesData: Array<{
                link_id: string;
                uploaded_by: string;
                kind: MediaKind;
                provider: MediaProvider;
                provider_ref: string;
                type_variant: MediaVariant;
                url: string;
                position: number;
              }>;
              
              if (incomingMedia.kind === 'video') {
                const videoUrl = `https://customer-kb0znv13nolt7e8g.cloudflarestream.com/${incomingMedia.id}/manifest/video.m3u8`;
                newFilesData = [{
                  link_id: serviceToUpdate.media_link_id,
                  uploaded_by: userId,
                  kind: MediaKind.video,
                  provider: MediaProvider.cloudflare_images,
                  provider_ref: incomingMedia.id,
                  type_variant: MediaVariant.public,
                  url: videoUrl,
                  position,
                }];
              } else {
                // Para imágenes, usar las variantes que vienen
                newFilesData = incomingMedia.variants.map((variantUrl) => ({
                  link_id: serviceToUpdate.media_link_id,
                  uploaded_by: userId,
                  kind: MediaKind.image,
                  provider: MediaProvider.cloudflare_images,
                  provider_ref: incomingMedia.id,
                  type_variant: this.getVariantFromUrl(variantUrl),
                  url: variantUrl,
                  position,
                }));
              }

              if (newFilesData.length > 0) {
                const createOp = tx.mediaFile.createMany({ data: newFilesData });
                mediaOperations.push(createOp);
              }
            }
          }

          if (mediaOperations.length > 0) {
            await Promise.all(mediaOperations);
          }
        }

        const updatedService = await tx.service.update({
          where: { id: serviceId },
          data: {
            title: dto.title,
            description: dto.description,
            base_price_cents: dto.price,
            currency: dto.currency,
            location_city: dto.city,
            lat: dto.lat,
            lon: dto.lon,
          },
          include: {
            categories: { include: { category: true } },
          },
        });

        return updatedService;
      });

      return {
        id: result.id,
        title: result.title,
        description: result.description,
        base_price_cents: result.base_price_cents,
        currency: result.currency,
        location_city: result.location_city,
        lat: result.lat,
        lon: result.lon,
        categories: result.categories.map((sc) => ({
          id: sc.category.id.toString(),
        })),
        created_at: result.created_at,
      };
    } catch (error) {
      console.error('Error updating service:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update service');
    }
  }
}
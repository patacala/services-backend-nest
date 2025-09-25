import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateServiceDto } from '../../infrastructure/dtos/service.dto';
import { MediaVariant } from '@prisma/client';

@Injectable()
export class CreateServiceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  private getVariantFromUrl(url: string): MediaVariant {
    const segments = url.split('/');
    const lastSegment = segments.pop() || '';

    if (Object.values(MediaVariant).includes(lastSegment as MediaVariant)) {
      return lastSegment as MediaVariant;
    }

    return MediaVariant.public;
  }

  async execute(userId: string, dto: CreateServiceDto) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const service = await tx.service.create({
          data: {
            user_id: userId,
            title: dto.title,
            description: dto.description,
            base_price_cents: dto.price ? Math.round(dto.price * 100) : null,
            currency: dto.currency ?? 'USD',
            location_city: dto.city,
            lat: dto.lat,
            lon: dto.lon,
            categories: {
              create: dto.categoryIds?.map((id) => ({
                category_id: BigInt(id),
              })),
            },
          },
          include: {
            categories: { include: { category: true } },
          },
        });

        const mediaLink = await tx.mediaLink.create({
          data: {
            owner_type: 'service',
            owner_id: service.id,
          },
        });

        await tx.service.update({
          where: { id: service.id },
          data: { media_link_id: mediaLink.media_id },
        });

        const mediaFilesCreationPromises = dto.media.flatMap(m =>
            m.variants.map(variant => {
                return tx.mediaFile.create({
                    data: {
                        link_id: mediaLink.media_id,
                        uploaded_by: userId,
                        kind: 'image',
                        provider: 'cloudflare_images',
                        provider_ref: m.providerRef,
                        type_variant: this.getVariantFromUrl(variant.url),
                        url: variant.url,
                    },
                });
            })
        );
        
        const createdMediaFiles = await Promise.all(mediaFilesCreationPromises);

        const media = {
          id: mediaLink.media_id,
          files: createdMediaFiles.map(file => ({
            id: file.id,
            url: file.url,
            variant: file.type_variant,
          })),
        };

        return {
          id: service.id,
          title: service.title,
          description: service.description,
          base_price_cents: service.base_price_cents,
          currency: service.currency,
          location_city: service.location_city,
          lat: service.lat,
          lon: service.lon,
          categories: service.categories.map((sc) => ({
            id: sc.category.id.toString(),
            name: sc.category.name_es, 
          })),
          media,
          created_at: service.created_at,
        };
      });

      return result;
    } catch (error) {
      console.error('Error creating service with media:', error);
      throw new BadRequestException('Failed to create service with media');
    }
  }
}
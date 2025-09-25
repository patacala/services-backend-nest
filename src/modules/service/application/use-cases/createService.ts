import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateServiceDto } from '../../infrastructure/dtos/service.dto';

@Injectable()
export class CreateServiceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateServiceDto) {
    if (!dto.title || !dto.description) {
      throw new BadRequestException('Title and description are required');
    }

    if (!dto.media || dto.media.length === 0) {
      throw new BadRequestException('At least one media is required');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Crear el servicio
        const service = await tx.service.create({
          data: {
            user_id: userId,
            title: dto.title,
            description: dto.description,
            base_price_cents: dto.price,
            currency: dto.currency ?? 'USD',
            location_city: dto.city,
            lat: dto.lat,
            lon: dto.lon,
            categories: dto.categoryIds
              ? {
                  create: dto.categoryIds.map((id) => ({
                    category_id: BigInt(id),
                  })),
                }
              : undefined,
          },
          include: {
            categories: { include: { category: true } },
          },
        });

        // Crear medias y links
        for (const m of dto.media) {
          const media = await tx.mediaFile.create({
            data: {
              uploaded_by: userId,
              provider_ref: m.providerRef,
              kind: 'image',
              provider: 'cloudflare_images',
              variants: {
                create: m.variants.map((v) => ({
                  name: v.name,
                  url: v.url,
                })),
              },
            },
          });

          await tx.mediaLink.create({
            data: {
              owner_type: 'service',
              owner_id: service.id,
              media_id: media.id,
            },
          });
        }

        // Volvemos a consultar con medias incluidas
        const medias = await tx.mediaLink.findMany({
          where: { owner_type: 'service', owner_id: service.id },
          include: {
            media: { include: { variants: true } },
          },
        });

        const media = medias.map((link) => ({
          id: link.media.id,
          providerRef: link.media.provider_ref,
          variants: link.media.variants.map((variant) => ({
            name: variant.name,
            url: variant.url,
          })),
        }));

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

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

type MediaImage = {
  id: string;
  variants: {
    name: string;
    url: string;
  }[];
};

@Injectable()
export class GetUserServicesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    try {
      const services = await this.prisma.service.findMany({
        where: {
          user_id: userId,
        },
        include: {
          categories: {
            include: { category: true },
          },
          user: {
            include: {
              profile: true,
            },
          },
          media_link: {
            include: {
              files: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const servicesMapped = services.map((service) => {
        let media: MediaImage[] = [];
        if (service.media_link && service.media_link.files.length > 0) {
          const imagesMap = new Map<string, MediaImage>();

          for (const file of service.media_link.files) {
            const providerRef = file.provider_ref;
            const variant = {
              name: file.type_variant,
              url: file.url,
            };

            if (!imagesMap.has(providerRef)) {
              imagesMap.set(providerRef, {
                id: providerRef,
                variants: [variant],
              });
            } else {
              imagesMap.get(providerRef)?.variants.push(variant);
            }
          }
          media = Array.from(imagesMap.values());
        }

        return {
          id: service.id,
          title: service.title,
          description: service.description,
          price: service.base_price_cents,
          currency: service.currency,
          categories: service.categories.map((sc) => sc.category.id.toString()),
          provider: {
            id: service.user.id,
            name: service.user.profile?.name ?? '',
          },
          rating: 0,
          reviewsCount: 0,
          city: service.location_city,
          lat: service.lat,
          lon: service.lon,
          media,
          createdAt: service.created_at,
          updatedAt: service.updated_at,
        };
      });

      return servicesMapped;
    } catch (error) {
      throw new BadRequestException('Failed to fetch user services');
    }
  }
}
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

// Tipo consistente para cualquier tipo de media (imagen o video)
type Media = {
  id: string;
  providerRef: string;
  kind: 'image' | 'video';
  variants: {
    [key: string]: { url: string };
  };
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
            select: {
              category: {
                select: { id: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              profile: {
                select: {
                  name: true,
                },
              },
            },
          },
          media_link: {
            include: {
              files: {
                orderBy: {
                  position: 'asc',
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const servicesMapped = services.map((service) => {
        let media: Media[] = [];
        if (service.media_link && service.media_link.files.length > 0) {
          const filesByProviderRef = service.media_link.files.reduce((acc, file) => {
            const key = file.provider_ref;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(file);
            return acc;
          }, {} as Record<string, (typeof service.media_link.files)[0][]>);

          media = Object.entries(filesByProviderRef).map(([providerRef, files]) => {
            const variants = files.reduce((acc, file) => {
              acc[file.type_variant] = { url: file.url };
              return acc;
            }, {} as Record<string, { url: string }>);

            return {
              id: service.media_link.media_id,
              providerRef,
              kind: files[0].kind,
              variants,
            };
          });
        }

        return {
          id: service.id,
          title: service.title,
          description: service.description,
          price: service.base_price_cents,
          currency: service.currency,
          status: service.status,
          categories: service.categories.map((sc) => sc.category.id.toString()),
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
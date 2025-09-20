import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

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
          coverMedia: true,
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      const servicesMapped = services.map((service) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.base_price_cents,
        currency: service.currency,
        categories: service.categories.map((sc) => sc.category.id.toString()),
        images: service.coverMedia ? [service.coverMedia.id] : [],
        provider: {
          id: service.user.id,
          name: service.user.profile?.name ?? '',
        },
        rating: 0,
        reviewsCount: 0,
        city: service.location_city,
        lat: service.lat,
        lon: service.lon,
        media: service.coverMedia ? [
          {
            id: service.coverMedia.id,
            url: service.coverMedia.public_url,
            kind: service.coverMedia.kind,
            provider: service.coverMedia.provider,
            created_at: service.coverMedia.created_at,
          }
        ] : [],
        createdAt: service.created_at,
        updatedAt: service.updated_at,
      }));

      return servicesMapped
    } catch (error) {
      console.error('Error fetching user services:', error);
      throw new BadRequestException('Failed to fetch user services');
    }
  }
}


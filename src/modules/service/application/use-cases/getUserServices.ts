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

      return services.map((service) => ({
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
        createdAt: service.created_at,
        updatedAt: service.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching user services:', error);
      throw new BadRequestException('Failed to fetch user services');
    }
  }
}


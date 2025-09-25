import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { Prisma } from '@prisma/client';

interface ListServicesParams {
  query?: string;
  tag?: string;
  cat?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  near?: string;
  radius?: string;
  page?: string;
  limit?: string;
}

@Injectable()
export class GetListServicesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(params: ListServicesParams, userId?: string) {
    try {
      const { query, tag, cat, minPrice, maxPrice, city, near, radius, page, limit } = params;
      const take = limit ? parseInt(limit, 10) : 10;
      const skip = page ? (parseInt(page, 10) - 1) * take : 0;

      const where: Prisma.ServiceWhereInput = {};
      const orderBy: Prisma.ServiceOrderByWithRelationInput = { created_at: 'desc' };

      // Exclude services of the requesting user
      if (userId) {
        where.user_id = { not: userId };
      }

      if (query) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ];
      }

      if (city) {
        where.location_city = { contains: city, mode: 'insensitive' };
      }

      if (cat) {
        const categoryIds = cat.split(',')
        .map(id => id.trim())
        .filter(id => id !== '')
        .map(id => {
            try {
                return id;
            } catch (error) {
                console.warn(`Invalid category ID: ${id}`);
                return null;
            }
        })
        .filter(id => id !== null) as [];

        if (categoryIds.length > 0) {
            where.categories = {
                some: {
                    category_id: {
                        in: categoryIds,
                    },
                },
            };
        }
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.base_price_cents = {};
        
        if (minPrice !== undefined) {
            const minPriceCents = parseInt(minPrice.toString(), 10);
            where.base_price_cents.gte = minPriceCents;
        }
        
        if (maxPrice !== undefined) {
            const maxPriceCents = parseInt(maxPrice.toString(), 10);
            where.base_price_cents.lte = maxPriceCents;
        }
      }

      if (tag) {
        if (!where.OR) {
          where.OR = [
            { title: { contains: tag, mode: 'insensitive' } },
            { description: { contains: tag, mode: 'insensitive' } },
          ];
        } else {
          (where.OR as Prisma.ServiceWhereInput[]).push(
            { title: { contains: tag, mode: 'insensitive' } },
            { description: { contains: tag, mode: 'insensitive' } },
          );
        }
      }

      if (near && radius) {
        const [latStr, lonStr] = near.split(',');
        const targetLat = parseFloat(latStr);
        const targetLon = parseFloat(lonStr);
        const searchRadius = parseFloat(radius);

        if (!isNaN(targetLat) && !isNaN(targetLon) && !isNaN(searchRadius)) {
            where.lat = {
                gte: targetLat - (searchRadius / 111.0),
                lte: targetLat + (searchRadius / 111.0),
            };
            where.lon = {
                gte: targetLon - (searchRadius / (111.0 * Math.cos(targetLat * Math.PI / 180))),
                lte: targetLon + (searchRadius / (111.0 * Math.cos(targetLat * Math.PI / 180))),
            };
        }
      }

      // Fetch services (without media)
      const services = await this.prisma.service.findMany({
        where,
        include: {
          categories: { include: { category: true } },
          user: { include: { profile: true } },
          favorites: userId
            ? { where: { user_id: userId } }
            : false,
        },
        orderBy,
        take,
        skip,
      });

      // Get all medias for these services
      const serviceIds = services.map((s) => s.id);
      const mediaLinks = await this.prisma.mediaLink.findMany({
        where: {
          owner_type: 'service',
          owner_id: { in: serviceIds },
        },
        include: {
          media: {
            include: { variants: true },
          },
        },
      });

      // Group medias by service_id
      const mediasByService = mediaLinks.reduce((acc, link) => {
        if (!acc[link.owner_id]) {
          acc[link.owner_id] = [];
        }
        acc[link.owner_id].push(link);
        return acc;
      }, {} as Record<string, typeof mediaLinks>);

      const formattedServices = services.map((service) => ({
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
        createdAt: service.created_at,
        updatedAt: service.updated_at,
        isFavorite: userId ? service.favorites.length > 0 : false,
        media: (mediasByService[service.id] ?? []).map((link) => ({
          id: link.media.id,
          providerRef: link.media.provider_ref,
          variants: link.media.variants.map((variant) => ({
            name: variant.name,
            url: variant.url,
          })),
        })),
      }));

      const totalServices = await this.prisma.service.count({ where });

      return {
        data: formattedServices,
        meta: {
          total: totalServices,
          page: page ? parseInt(page, 10) : 1,
          limit: take,
          totalPages: Math.ceil(totalServices / take),
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch user services');
    }
  }
}

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

      const where: Prisma.ServiceWhereInput = { status: 'published' };
      const orderBy: Prisma.ServiceOrderByWithRelationInput = { created_at: 'desc' };

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
        const categoryIds = cat
          .split(',')
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id));

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
          where.base_price_cents.gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
          where.base_price_cents.lte = Number(maxPrice);
        }
      }

      if (tag) {
        where.tags = {
            some: {
                tag: {
                    slug: tag
                }
            }
        }
      }

      if (near && radius) {
        const [latStr, lonStr] = near.split(',');
        const targetLat = parseFloat(latStr);
        const targetLon = parseFloat(lonStr);
        const searchRadius = parseFloat(radius);

        if (!isNaN(targetLat) && !isNaN(targetLon) && !isNaN(searchRadius)) {
          const latRadius = searchRadius / 111.0;
          const lonRadius = searchRadius / (111.0 * Math.cos(targetLat * (Math.PI / 180)));
          where.lat = { gte: targetLat - latRadius, lte: targetLat + latRadius };
          where.lon = { gte: targetLon - lonRadius, lte: targetLon + lonRadius };
        }
      }

      const services = await this.prisma.service.findMany({
        where,
        include: {
          categories: { select: { category_id: true } },
          user: { select: { id: true, profile: { select: { name: true } } } },
          favorites: userId ? { where: { user_id: userId } } : false,
          media_link: {
            include: {
              files: true,
            },
          },
        },
        orderBy,
        take,
        skip,
      });

      const formattedServices = services.map((service) => {
        let media = null;
        if (service.media_link && service.media_link.files.length > 0) {
          const providerRef = service.media_link.files[0]?.provider_ref || null;
          media = {
            id: service.media_link.media_id,
            providerRef,
            variants: service.media_link.files.map((file) => ({
              name: file.type_variant,
              url: file.url,
            })),
          };
        }

        return {
          id: service.id,
          title: service.title,
          description: service.description,
          price: service.base_price_cents,
          currency: service.currency,
          categories: service.categories.map((sc) => sc.category_id.toString()),
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
          media,
        };
      });

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
      console.error('Failed to fetch services:', error);
      throw new BadRequestException('Failed to fetch services');
    }
  }
}
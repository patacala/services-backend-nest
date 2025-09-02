import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { Prisma } from '@prisma/client';

interface ListServicesParams {
    query?: string;
    tag?: string;
    cat?: string;
    minPrice?: number,
    maxPrice?: number,
    city?: string;
    near?: string;
    radius?: string;
    page?: string;
    limit?: string;
}

@Injectable()
export class GetListServicesUseCase {
    constructor(private readonly prisma: PrismaService) {}

    async execute(params: ListServicesParams) {
        try {
            const { query, tag, cat, minPrice, maxPrice, city, near, radius, page, limit } = params;
            const take = limit ? parseInt(limit, 10) : 10;
            const skip = page ? (parseInt(page, 10) - 1) * take : 0;

            const where: Prisma.ServiceWhereInput = {};
            const orderBy: Prisma.ServiceOrderByWithRelationInput = { created_at: 'desc' };

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
            
            const services = await this.prisma.service.findMany({
                where: where,
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
                orderBy: orderBy,
                take: take,
                skip: skip,
            });

            const totalServices = await this.prisma.service.count({ where });
            const formattedServices = services.map((service) => ({
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
            console.error('Error fetching user services:', error);
            throw new BadRequestException('Failed to fetch user services');
        }
    }
}
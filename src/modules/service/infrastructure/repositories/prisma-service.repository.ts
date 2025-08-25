import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceStatus } from '@prisma/client';

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ServiceEntity): Promise<ServiceEntity> {
    const service = await this.prisma.service.create({
      data: {
        user_id: data.user_id!,
        title: data.title!,
        description: data.description!,
        base_price_cents: data.base_price_cents ?? null,
        currency: data.currency ?? 'USD',
        status: (data.status as ServiceStatus) ?? ServiceStatus.published,
        location_city: data.location_city ?? null,
        lat: data.lat ?? null,
        lon: data.lon ?? null,
        cover_media_id: data.cover_media_id ?? null,
        categories: {
          create: data.categories!.map((categoryId) => ({
            category_id: BigInt(categoryId),
          })),
        },
      },
      include: {
        categories: {
          include: { category: true },
        },
        coverMedia: true,
      },
    });

    return this.mapToEntity(service);
  }

  private mapToEntity(service: any): ServiceEntity {
    return new ServiceEntity(
      service.id,
      service.user_id,
      service.title,
      service.description,
      service.base_price_cents,
      service.currency,
      service.status,
      service.location_city,
      service.lat,
      service.lon,
      service.cover_media_id,
      service.coverMedia
      ? {
          id: service.coverMedia.id,
          url: service.coverMedia.url,
        }
      : null,
      service.categories?.map((sc: any) => sc.category.id.toString()) ?? [],
      service.created_at,
      service.updated_at,
    );
  }
}
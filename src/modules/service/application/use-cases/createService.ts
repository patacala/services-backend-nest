import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateServiceDto } from '../../infrastructure/dtos/service.dto';


@Injectable()
export class CreateServiceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateServiceDto) {
    try {
      if (!dto.title || !dto.description) {
        throw new BadRequestException('Title and description are required');
      }

      // Crear el servicio
      const service = await this.prisma.service.create({
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
          categories: {
            include: { category: true },
          },
        },
      });

      // Transformar BigInt a string
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
        created_at: service.created_at,
      };
    } catch (error) {
      console.error('Error creating service:', error);
      throw new BadRequestException('Failed to create service');
    }
  }
}

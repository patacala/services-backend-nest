import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateServiceDto } from '../../infrastructure/dtos/service.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, serviceId: string, dto: UpdateServiceDto) {
    try {
      const serviceToUpdate = await this.prisma.service.findUnique({
        where: { id: serviceId, user_id: userId },
      });

      if (!serviceToUpdate) {
        throw new NotFoundException('Service not found or does not belong to the user');
      }

      if (dto.categoryIds) {
        await this.prisma.serviceCategory.deleteMany({
          where: { service_id: serviceId },
        });

        await this.prisma.serviceCategory.createMany({
          data: dto.categoryIds.map((categoryId) => ({
            service_id: serviceId,
            category_id: BigInt(categoryId),
          })),
        });
      }

      const dataToUpdate = {
        title: dto.title,
        description: dto.description,
        base_price_cents: dto.price,
        currency: dto.currency,
        location_city: dto.city,
        lat: dto.lat,
        lon: dto.lon,
        cover_media_id: dto.coverMediaId && dto.coverMediaId.trim() !== '' 
          ? dto.coverMediaId 
          : null,
      };

      const updatedService = await this.prisma.service.update({
        where: { id: serviceId },
        data: dataToUpdate,
        include: {
          categories: {
            include: { category: true },
          },
          coverMedia: true,
        },
      });

      return {
        id: updatedService.id,
        title: updatedService.title,
        description: updatedService.description,
        base_price_cents: updatedService.base_price_cents,
        currency: updatedService.currency,
        location_city: updatedService.location_city,
        lat: updatedService.lat,
        lon: updatedService.lon,
        cover_media_id: updatedService.cover_media_id,
        categories: updatedService.categories.map((sc) => ({
          id: sc.category.id.toString(),
        })),
        coverMedia: updatedService.coverMedia
          ? {
              id: updatedService.coverMedia.id,
            }
          : null,
        created_at: updatedService.created_at,
        updated_at: updatedService.updated_at,
      };
    } catch (error) {
      console.error('Error updating service:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update service');
    }
  }
}

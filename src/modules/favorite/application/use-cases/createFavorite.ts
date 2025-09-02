import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateFavoriteDto } from '../../infrastructure/dtos/favorite.dto';

@Injectable()
export class CreateFavoriteUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateFavoriteDto) {
    try {
      if (!dto.user_id || !dto.service_id) {
        throw new BadRequestException('User ID and Service ID are required');
      }

      // Verificar si el servicio existe
      const service = await this.prisma.service.findUnique({
        where: { id: dto.service_id },
      });

      if (!service) {
        throw new BadRequestException('Service not found');
      }

      // Verificar si ya existe el favorito
      const existingFavorite = await this.prisma.favorite.findUnique({
        where: {
          user_id_service_id: {
            user_id: dto.user_id,
            service_id: dto.service_id,
          },
        },
      });

      if (existingFavorite) {
        throw new ConflictException('Service is already in favorites');
      }

      // Crear el favorito
      const favorite = await this.prisma.favorite.create({
        data: {
          user_id: dto.user_id,
          service_id: dto.service_id,
        },
      });

      return {
        user_id: favorite.user_id,
        service_id: favorite.service_id,
        created_at: favorite.created_at,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create favorite');
    }
  }
}
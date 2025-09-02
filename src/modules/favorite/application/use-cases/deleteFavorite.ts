import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { DeleteFavoriteDto } from '../../infrastructure/dtos/favorite.dto';

@Injectable()
export class DeleteFavoriteUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: DeleteFavoriteDto) {
    try {
      if (!dto.user_id || !dto.service_id) {
        throw new BadRequestException('User ID and Service ID are required');
      }

      // Verificar si el favorito existe
      const existingFavorite = await this.prisma.favorite.findUnique({
        where: {
          user_id_service_id: {
            user_id: dto.user_id,
            service_id: dto.service_id,
          },
        },
      });

      if (!existingFavorite) {
        throw new BadRequestException('Favorite not found');
      }

      // Eliminar el favorito
      await this.prisma.favorite.delete({
        where: {
          user_id_service_id: {
            user_id: dto.user_id,
            service_id: dto.service_id,
          },
        },
      });

      return {
        message: 'Favorite removed successfully',
        user_id: dto.user_id,
        service_id: dto.service_id,
      };
    } catch (error) {
      console.error('Error removing favorite:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to remove favorite');
    }
  }
}
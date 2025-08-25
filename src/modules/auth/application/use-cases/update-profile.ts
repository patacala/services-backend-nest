import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateProfileDto } from '../../infrastructure/dtos/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    try {
      // Buscar el perfil por su ID
      const profile = await this.prisma.profile.findUnique({
        where: { user_id: userId },
      });

      // Si no se encuentra el perfil, lanzar una excepción
      if (!profile) {
        throw new NotFoundException(`Perfil con ID ${userId} no encontrado.`);
      }

      // Actualizar el perfil con los campos permitidos
      await this.prisma.profile.update({
        where: { user_id: userId },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.city && { location_city: dto.city }),
          ...(dto.address && { address: dto.address }),
        },
      });

      return { 
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  }
}

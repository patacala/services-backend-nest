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

      // Actualizar el perfil
      const updatedProfile = await this.prisma.profile.update({
        where: { user_id: userId },
        data: {
          ...(dto.name && { displayName: dto.name }), // Solo actualizar si el campo no es undefined
          ...(dto.email && { email: dto.email }),
          /* ...(dto.phone && { phone: dto.phone }), */
        },
      });

      // Retornar el perfil actualizado (opcional)
      return {
        id: updatedProfile.user_id,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
      };
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error; // Manejo de errores puede ser más específico si se desea
    }
  }
}
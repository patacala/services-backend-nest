import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    try {
      // Buscar el perfil por el ID del usuario
      const profile = await this.prisma.profile.findUnique({
        where: { user_id: userId },
      });

      // Si no se encuentra, lanzar excepción
      if (!profile) {
        throw new UnauthorizedException(`Perfil con ID ${userId} no encontrado.`);
      }

      return {
        profile_id: profile.user_id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        city: profile.location_city,
        address: profile.address
      };
    } catch (error) {
      throw error;
    }
  }
}

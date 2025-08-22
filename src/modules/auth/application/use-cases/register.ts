import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { PrismaService } from '@/shared/prisma.service';
import { RegisterDto } from '../../infrastructure/dtos/register.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: RegisterDto & { userId: string }): Promise<{ message: string; profile: any, user: any }> {
    const { userId, name, email, phone, city, selectedCategories } = data;
  
    // Validar que el usuario existe
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    // Validar que no existe ya un perfil para este usuario
    const existingProfile = await this.prisma.profile.findUnique({
      where: { user_id: userId }
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    // Validar categorías si se proporcionan
    if (selectedCategories && selectedCategories.length > 0) {
      const validCategories = await this.prisma.category.findMany({
        where: {
          id: {
            in: selectedCategories.map(id => BigInt(id))
          }
        }
      });

      if (validCategories.length !== selectedCategories.length) {
        throw new BadRequestException('One or more categories are invalid');
      }
    }

    // Usar transacción para asegurar atomicidad
    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Crear el perfil
        const profile = await tx.profile.create({
          data: {
            user_id: userId,
            name,
            email,
            phone,
            location_city: city,
            bio: null,
            location_country: null,
            lat: null,
            lon: null,
            avatar_media_id: null,
            address: null
          }
        });

        // 2. Crear relaciones con categorías si existen
        if (selectedCategories && selectedCategories.length > 0) {
          const userCategories = selectedCategories.map(categoryId => ({
            userId,
            categoryId: BigInt(categoryId)
          }));

          await tx.userCategory.createMany({
            data: userCategories
          });
        }

        return profile;
      });

      // Obtener el perfil completo con las relaciones para la respuesta
      const completeProfile = await this.prisma.profile.findUnique({
        where: { user_id: userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
            }
          }
        }
      });

      // Transformar la respuesta
      const transformedProfile = {
        user_id: completeProfile.user_id,
        name: completeProfile.name,
        email: completeProfile.email,
        phone: completeProfile.phone,
        location_city: completeProfile.location_city,
        location_country: completeProfile.location_country,
        bio: completeProfile.bio,
        lat: completeProfile.lat,
        lon: completeProfile.lon,
        avatar_media_id: completeProfile.avatar_media_id,
        adress: completeProfile.address
      };

      type UserWithNewStatus = PrismaUser & {
        isNewUser: boolean;
      };

      const userWithNewStatus: UserWithNewStatus = {
          ...userExists,
          isNewUser: false
      };

      return {
        message: 'Profile completed',
        profile: transformedProfile,
        user: userWithNewStatus
      };

    } catch (error) {
      console.error('Error completing profile:', error);
      
      // Si es un error de validación de Prisma
      if (error.code === 'P2002') {
        throw new BadRequestException('Profile already exists or duplicate constraint violation');
      }
      
      // Si es un error de foreign key
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid user ID or category ID provided');
      }

      // Para otros errores
      throw new InternalServerErrorException('Failed to complete profile registration');
    }
  }
}
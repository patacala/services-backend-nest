import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateProfileDto } from '../../infrastructure/dtos/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { user_id: userId },
      });

      if (!profile) {
        throw new NotFoundException(`Perfil con ID ${userId} no encontrado.`);
      }

      if (dto.media) {
        await this.prisma.$transaction(async (tx) => {
          // 1. Eliminar media anterior
          const oldLinks = await tx.mediaLink.findMany({
            where: { owner_type: 'profile', owner_id: userId },
            include: { media: true },
          });

          for (const link of oldLinks) {
            // 1. Borrar variantes
            await tx.mediaVariant.deleteMany({
              where: { media_file_id: link.media_id },
            });

            // 2. Borrar link
            await tx.mediaLink.delete({
              where: {
                owner_type_owner_id_media_id: {
                  owner_type: 'profile',
                  owner_id: userId,
                  media_id: link.media_id,
                },
              },
            });

            // 3. Borrar archivo
            await tx.mediaFile.delete({
              where: { id: link.media_id },
            });
          }

          // 2. Crear nuevo MediaFile
          const newMedia = await tx.mediaFile.create({
            data: {
              uploaded_by: userId,
              kind: 'image',
              provider: 'cloudflare_images',
              provider_ref: dto.media.id,
            },
          });

          // 3. Crear variantes
          await tx.mediaVariant.createMany({
            data: dto.media.variants.map((url: string) => {
              const parts = url.split('/');
              const lastSegment = parts[parts.length - 1];
              const variantName = lastSegment.includes('-') ? lastSegment : lastSegment;

              return {
                media_file_id: newMedia.id,
                name: variantName,
                url,
              };
            }),
          });

          // 4. Crear MediaLink
          await tx.mediaLink.create({
            data: {
              media_id: newMedia.id,
              owner_type: 'profile',
              owner_id: userId,
              position: 0,
            },
          });
        });
      }

      // Actualizar datos básicos del perfil
      await this.prisma.profile.update({
        where: { user_id: userId },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.city && { location_city: dto.city }),
          ...(dto.address && { address: dto.address }),
        },
      });

      return { message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  }
}

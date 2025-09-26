import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateProfileDto } from '../../infrastructure/dtos/update-profile.dto';
import { MediaVariant } from '@prisma/client';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  private getVariantFromUrl(url: string): MediaVariant {
    const segments = url.split('/');
    const lastSegment = segments.pop() || '';

    if (Object.values(MediaVariant).includes(lastSegment as MediaVariant)) {
      return lastSegment as MediaVariant;
    }
    
    return MediaVariant.public;
  }

  async execute(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil con ID de usuario ${userId} no encontrado.`);
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const profileDataToUpdate = {
          name: dto.name,
          location_city: dto.city,
          address: dto.address,
        };

        if (!dto.media) {
          return tx.profile.update({
            where: { user_id: userId },
            data: profileDataToUpdate,
          });
        }

        if (profile.media_link_id) {
          await tx.mediaLink.delete({
            where: { media_id: profile.media_link_id },
          });
        }

        const newMediaLink = await tx.mediaLink.create({
          data: {
            owner_type: 'profile',
            owner_id: userId,
          },
        });

        await tx.mediaFile.createMany({
          data: dto.media.variants.map((variantUrl: string) => ({
            link_id: newMediaLink.media_id,
            uploaded_by: userId,
            kind: 'image',
            provider: 'cloudflare_images',
            provider_ref: dto.media.id,
            type_variant: this.getVariantFromUrl(variantUrl),
            url: variantUrl
          })),
        });

        return tx.profile.update({
          where: { user_id: userId },
          data: {
            ...profileDataToUpdate,
            media_link_id: newMediaLink.media_id,
          },
        });
      });

      return { message: 'Perfil actualizado exitosamente.', profile: result };
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw new BadRequestException('No se pudo actualizar el perfil.');
    }
  }
}
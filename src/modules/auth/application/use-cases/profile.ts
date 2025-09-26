import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { user_id: userId },
        include: {
          media_link: {
            include: {
              files: true,
            },
          },
        },
      });

      if (!profile) {
        throw new NotFoundException(`Perfil con ID de usuario ${userId} no encontrado.`);
      }
      
      let media = null;
      if (profile.media_link && profile.media_link.files.length > 0) {
        const providerRef = profile.media_link.files[0]?.provider_ref || null;

        media = [{
          id: profile.media_link.media_id,
          providerRef,
          variants: profile.media_link.files.map((file) => ({
            name: file.type_variant,
            url: file.url,
          })),
        }];
      }

      return {
        profile_id: profile.user_id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        city: profile.location_city,
        address: profile.address,
        media,
      };
    } catch (error) {
      throw error;
    }
  }
}
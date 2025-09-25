import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { user_id: userId },
      });

      if (!profile) {
        throw new UnauthorizedException(`Perfil con ID ${userId} no encontrado.`);
      }

      const mediaLinks = await this.prisma.mediaLink.findMany({
        where: {
          owner_type: 'profile',
          owner_id: userId,
        },
        include: {
          media: {
            include: { variants: true },
          },
        },
      });

      const media = mediaLinks.map((link) => ({
        id: link.media.id,
        providerRef: link.media.provider_ref,
        variants: link.media.variants.map((variant) => ({
          name: variant.name,
          url: variant.url,
        })),
      }));

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

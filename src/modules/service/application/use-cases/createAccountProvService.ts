import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateServiceDto } from '../../infrastructure/dtos/service.dto';
import { JwtService } from '@nestjs/jwt';
import { MediaVariant } from '@prisma/client';

@Injectable()
export class CreateAccountProvServiceUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    private getVariantFromUrl(url: string): MediaVariant {
        const segments = url.split('/');
        const lastSegment = segments.pop() || '';

        if (Object.values(MediaVariant).includes(lastSegment as MediaVariant)) {
            return lastSegment as MediaVariant;
        }
        
        return MediaVariant.public;
    }

    async execute(userId: string, dto: CreateServiceDto) {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const updatedUser = await tx.user.update({
                    where: { id: userId },
                    data: { role: 'both' }
                });

                const service = await tx.service.create({
                    data: {
                        user_id: userId,
                        title: dto.title,
                        description: dto.description,
                        base_price_cents: dto.price,
                        currency: dto.currency ?? 'USD',
                        location_city: dto.city,
                        lat: dto.lat,
                        lon: dto.lon,
                        categories: dto.categoryIds
                            ? {
                                create: dto.categoryIds.map((id) => ({
                                    category_id: BigInt(id),
                                })),
                            }
                            : undefined,
                        media_link_id: null
                    },
                    include: {
                        categories: {
                            include: { category: true },
                        },
                    },
                });

                let mediaLinkId: string | null = null;
                if (dto.media && dto.media.length > 0) {
                    const newMediaLink = await tx.mediaLink.create({
                        data: {
                            owner_type: 'service',
                            owner_id: service.id,
                        },
                    });

                    mediaLinkId = newMediaLink.media_id;
                    const mediaFilesToCreate = [];
                    
                    for (const mediaItem of dto.media) {
                        for (const variant of mediaItem.variants) {
                            mediaFilesToCreate.push({
                                link_id: newMediaLink.media_id,
                                uploaded_by: userId,
                                kind: 'image',
                                provider: 'cloudflare_images',
                                provider_ref: mediaItem.id,
                                type_variant: this.getVariantFromUrl(variant),
                                url: variant                                 
                            });
                        }
                    }

                    await tx.mediaFile.createMany({
                        data: mediaFilesToCreate,
                    });

                    await tx.service.update({
                        where: { id: service.id },
                        data: { media_link_id: mediaLinkId },
                    });
                }

                return { updatedUser, service, mediaLinkId };
            });

            const payload = { sub: result.updatedUser.id, role: result.updatedUser.role };
            const token = this.jwt.sign(payload, { expiresIn: '7d' });

            return {
                token,
                user: {
                    id: result.updatedUser.id,
                    displayName: result.updatedUser.displayName,
                    email: result.updatedUser.email,
                    role: result.updatedUser.role,
                    isNewUser: false,
                },
                service: {
                    id: result.service.id,
                    title: result.service.title,
                    description: result.service.description,
                    base_price_cents: result.service.base_price_cents,
                    currency: result.service.currency,
                    location_city: result.service.location_city,
                    lat: result.service.lat,
                    lon: result.service.lon,
                    categories: result.service.categories.map((sc) => ({
                        id: sc.category.id.toString(),
                    })),
                    created_at: result.service.created_at,
                },
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException('Failed to create account provider service');
        }
    }
}
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateServiceDto } from '../../infrastructure/dtos/service.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreateAccountProvServiceUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    async execute(userId: string, dto: CreateServiceDto) {
        try {
        if (!dto.title || !dto.description) {
            throw new BadRequestException('Title and description are required');
        }

        // Usar transacción para asegurar que ambas operaciones se completen
        const result = await this.prisma.$transaction(async (prisma) => {
            // 1. Actualizar el rol del usuario a 'both'
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { role: 'both' }
            });

            // 2. Crear el servicio
            const service = await prisma.service.create({
            data: {
                user_id: userId,
                title: dto.title,
                description: dto.description,
                base_price_cents: dto.price,
                currency: dto.currency ?? 'USD',
                location_city: dto.city,
                lat: dto.lat,
                lon: dto.lon,
                cover_media_id: dto.coverMediaId && dto.coverMediaId.trim() !== '' 
                ? dto.coverMediaId : null,
                categories: dto.categoryIds
                ? {
                    create: dto.categoryIds.map((id) => ({
                        category_id: BigInt(id),
                    })),
                    }
                : undefined,
            },
            include: {
                categories: {
                include: { category: true },
                },
                coverMedia: true,
            },
            });

            return { updatedUser, service };
        });

        // Crear payload del JWT, vence en 7 dias
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
                cover_media_id: result.service.cover_media_id,
                categories: result.service.categories.map((sc) => ({
                    id: sc.category.id.toString(),
                })),
                coverMedia: result.service.coverMedia
                    ? {
                        id: result.service.coverMedia.id,
                        /* url: result.service.coverMedia.url, */
                    }
                    : null,
                created_at: result.service.created_at,
            },
        };
        } catch (error) {
        console.error('Error creating account provider service:', error);
        throw new BadRequestException('Failed to create account provider service');
        }
    }
}
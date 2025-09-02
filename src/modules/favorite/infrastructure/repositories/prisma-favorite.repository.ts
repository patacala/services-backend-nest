import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { FavoriteRepository } from '../../domain/repositories/favorite.respository';

@Injectable()
export class PrismaFavoriteRepository implements FavoriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, serviceId: string): Promise<FavoriteEntity> {
    const favorite = await this.prisma.favorite.create({
      data: {
        user_id: userId,
        service_id: serviceId,
      },
    });

    return new FavoriteEntity(
      favorite.user_id,
      favorite.service_id,
      favorite.created_at,
    );
  }

  async delete(userId: string, serviceId: string): Promise<void> {
    await this.prisma.favorite.delete({
      where: {
        user_id_service_id: {
          user_id: userId,
          service_id: serviceId,
        },
      },
    });
  }

  async findByUserAndService(userId: string, serviceId: string): Promise<FavoriteEntity | null> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        user_id_service_id: {
          user_id: userId,
          service_id: serviceId,
        },
      },
    });

    return favorite ? new FavoriteEntity(
      favorite.user_id,
      favorite.service_id,
      favorite.created_at,
    ) : null;
  }
}
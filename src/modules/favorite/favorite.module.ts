import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@/shared/shared.module';
import { FavoriteController } from './infrastructure/controllers/favorite.controller';
import { PrismaFavoriteRepository } from './infrastructure/repositories/prisma-favorite.repository';
import { FavoriteRepository } from './domain/repositories/favorite.respository';
import { CreateFavoriteUseCase } from './application/use-cases/createFavorite';
import { DeleteFavoriteUseCase } from './application/use-cases/deleteFavorite';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
  ],
  controllers: [FavoriteController],
  providers: [
    {
      provide: FavoriteRepository,
      useClass: PrismaFavoriteRepository,
    },
    CreateFavoriteUseCase,
    DeleteFavoriteUseCase,
  ],
  exports: [FavoriteRepository],
})
export class FavoriteModule {}

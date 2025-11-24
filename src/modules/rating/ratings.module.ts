import { Module } from '@nestjs/common';
import { RatingController } from './infrastructure/controllers/rating.controller';
import { PrismaService } from '@/shared/prisma.service';
import { CreateRatingUseCase } from './application/use-cases/createRating';
import { UpdateRatingUseCase } from './application/use-cases/updateRating';
import { DeleteRatingUseCase } from './application/use-cases/deleteRating';
import { GetRatingsByUserUseCase } from './application/use-cases/getRatingsByUser';

@Module({
  controllers: [RatingController],
  providers: [
    CreateRatingUseCase,
    GetRatingsByUserUseCase,
    UpdateRatingUseCase,
    DeleteRatingUseCase,
    PrismaService,
  ],
  exports: [GetRatingsByUserUseCase],
})
export class RatingsModule {}
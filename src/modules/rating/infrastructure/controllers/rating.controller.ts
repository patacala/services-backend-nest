// ratings/infrastructure/controllers/rating.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CreateRatingDto, UpdateRatingDto } from '../dtos/rating.dto';
import { CreateRatingUseCase } from '../../application/use-cases/createRating';
import { GetRatingsByUserUseCase } from '../../application/use-cases/getRatingsByUser';
import { UpdateRatingUseCase } from '../../application/use-cases/updateRating';
import { DeleteRatingUseCase } from '../../application/use-cases/deleteRating';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ratings')
export class RatingController {
  constructor(
    private readonly createRatingUseCase: CreateRatingUseCase,
    private readonly getRatingsByUserUseCase: GetRatingsByUserUseCase,
    private readonly updateRatingUseCase: UpdateRatingUseCase,
    private readonly deleteRatingUseCase: DeleteRatingUseCase,
  ) {}

  @Post()
  async createRating(@Req() req: any, @Body() dto: CreateRatingDto) {
    return this.createRatingUseCase.execute(req.user.userId, dto);
  }

  @Get('user/:userId')
  async getRatingsByUser(
    @Param('userId') userId: string,
    @Query('serviceId') serviceId?: string
  ) {
    return this.getRatingsByUserUseCase.execute(userId, serviceId);
  }

  @Put(':id')
  async updateRating(
    @Req() req: any,
    @Param('id') ratingId: string,
    @Body() dto: UpdateRatingDto
  ) {
    return this.updateRatingUseCase.execute(req.user.userId, ratingId, dto);
  }

  @Delete(':id')
  async deleteRating(@Req() req: any, @Param('id') ratingId: string) {
    return this.deleteRatingUseCase.execute(req.user.userId, ratingId);
  }
}
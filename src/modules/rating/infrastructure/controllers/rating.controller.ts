// ratings/infrastructure/controllers/rating.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CreateRatingDto, UpdateRatingDto } from '../dtos/rating.dto';
import { CreateRatingUseCase } from '../../application/use-cases/createRating';
import { GetRatingsByUserUseCase } from '../../application/use-cases/getRatingsByUser';
import { UpdateRatingUseCase } from '../../application/use-cases/updateRating';
import { DeleteRatingUseCase } from '../../application/use-cases/deleteRating';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { GetRatingsByServiceUseCase } from '../../application/use-cases/getRatingsByService';

@UseGuards(JwtAuthGuard)
@Controller('ratings')
export class RatingController {
  constructor(
    private readonly createRatingUseCase: CreateRatingUseCase,
    private readonly getRatingsByUserUseCase: GetRatingsByUserUseCase,
    private readonly getRatingsByServiceUseCase: GetRatingsByServiceUseCase,
    private readonly updateRatingUseCase: UpdateRatingUseCase,
    private readonly deleteRatingUseCase: DeleteRatingUseCase,
  ) {}

  @Post()
  async createRating(@Req() req: any, @Body() dto: CreateRatingDto) {
    const userId = req.user.id;
    return this.createRatingUseCase.execute(userId, dto);
  }

  @Get('user')
  async getRatingsByUser(@Req() req: any) {
    const userId = req.user.id;
    return this.getRatingsByUserUseCase.execute(userId);
  }

  @Get('service/:id')
  async getRatingsByService(@Param('id') serviceId: string,) {
    return this.getRatingsByServiceUseCase.execute(serviceId);
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
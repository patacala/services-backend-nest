import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { CreateFavoriteDto, DeleteFavoriteDto } from '../dtos/favorite.dto';
import { CreateFavoriteUseCase } from '../../application/use-cases/createFavorite';
import { DeleteFavoriteUseCase } from '../../application/use-cases/deleteFavorite';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(
    private readonly createFavoriteUC: CreateFavoriteUseCase,
    private readonly deleteFavoriteUC: DeleteFavoriteUseCase,
  ) {}

  @Post()
  async createFavorite(@Req() req, @Body() dto: CreateFavoriteDto) {
    dto.user_id = req.user.id;
    return this.createFavoriteUC.execute(dto);
  }

  @Delete(':serviceId')
  async deleteFavorite(@Req() req, @Param('serviceId') serviceId: string) {
    const userId = req.user.id;
    return this.deleteFavoriteUC.execute({user_id: userId, service_id: serviceId});
  }
}
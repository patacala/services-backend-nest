import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { CreateBookServiceDto } from '../dtos/bookService.dto';
import { CreateBookServiceUseCase } from '../../application/use-cases/createBookService';
import { GetUserBookServicesUseCase } from '../../application/use-cases/getUserBookServices';

@UseGuards(JwtAuthGuard)
@Controller('book-services')
export class BookServiceController {
  constructor(
    private readonly createBookServiceUC: CreateBookServiceUseCase,
    private readonly getUserBookServicesUC: GetUserBookServicesUseCase
  ) {}

  @Post()
  async createBookService(@Req() req, @Body() dto: CreateBookServiceDto) {
    const userId = req.user.id;
    return this.createBookServiceUC.execute(userId, dto);
  }

  @Get('me')
  async getUserBookings(@Req() req) {
    const userId = req.user.id;
    return this.getUserBookServicesUC.execute(userId);
  }
}

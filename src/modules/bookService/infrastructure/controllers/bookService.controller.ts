import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { CreateBookServiceDto } from '../dtos/bookService.dto';
import { CreateBookServiceUseCase } from '../../application/use-cases/bookService';

@UseGuards(JwtAuthGuard)
@Controller('bookServices')
export class BookServiceController {
  constructor(
    private readonly createBookServiceUC: CreateBookServiceUseCase,
  ) {}

  @Post()
  async createService(@Req() req, @Body() dto: CreateBookServiceDto) {
    const userId = req.user.id;
    return this.createBookServiceUC.execute(userId, dto);
  }
}

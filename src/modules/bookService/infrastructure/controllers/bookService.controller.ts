import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { CreateBookServiceDto, UpdateBookServiceStatusDto } from '../dtos/bookService.dto';
import { CreateBookServiceUseCase } from '../../application/use-cases/createBookService';
import { GetUserBookServicesUseCase } from '../../application/use-cases/getUserBookServices';
import { UpdateBookServiceStatusUseCase } from '../../application/use-cases/updateStatusBookService';

@UseGuards(JwtAuthGuard)
@Controller('book-services')
export class BookServiceController {
  constructor(
    private readonly createBookServiceUC: CreateBookServiceUseCase,
    private readonly getUserBookServicesUC: GetUserBookServicesUseCase,
    private readonly updateBookServiceStatusUC: UpdateBookServiceStatusUseCase
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
  
  @Patch(':id/status')
  async updateBookingStatus(
    @Req() req,
    @Param('id') bookingId: string,
    @Body() dto: UpdateBookServiceStatusDto
  ) {
    const userId = req.user.id;
    return this.updateBookServiceStatusUC.execute(userId, bookingId, dto);
  }
}

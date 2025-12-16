import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { CreateMessageDto } from '../dtos/message.dto';
import { CreateMessageUseCase } from '../../application/use-cases/createMessage';
import { GetMessagesUseCase } from '../../application/use-cases/getMessages';
import { MarkMessagesAsReadUseCase } from '../../application/use-cases/markMessagesAsRead';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(
    private readonly createMessageUC: CreateMessageUseCase,
    private readonly getMessagesUC: GetMessagesUseCase,
    private readonly markMessagesAsReadUC: MarkMessagesAsReadUseCase,
  ) {}

  @Post()
  async createMessage(@Req() req, @Body() dto: CreateMessageDto) {
    const userId = req.user.id;
    return this.createMessageUC.execute(userId, dto);
  }

  @Get('book-service/:bookServiceId')
  async getMessages(@Req() req, @Param('bookServiceId') bookServiceId: string) {
    const userId = req.user.id;
    return this.getMessagesUC.execute(userId, bookServiceId);
  }

  @Post('book-service/:bookServiceId/read')
  async markAsRead(@Req() req, @Param('bookServiceId') bookServiceId: string) {
    const userId = req.user.id;
    return this.markMessagesAsReadUC.execute(userId, bookServiceId);
  }
}
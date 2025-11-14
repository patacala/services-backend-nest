import { Module } from '@nestjs/common';
import { MessageController } from './infrastructure/controllers/message.controller';
import { CreateMessageUseCase } from './application/use-cases/createMessage';
import { GetMessagesUseCase } from './application/use-cases/getMessages';
import { MarkMessagesAsReadUseCase } from './application/use-cases/markMessagesAsRead';
import { PrismaService } from '@/shared/prisma.service';

@Module({
  controllers: [MessageController],
  providers: [
    PrismaService,
    CreateMessageUseCase,
    GetMessagesUseCase,
    MarkMessagesAsReadUseCase,
  ],
  exports: [
    CreateMessageUseCase,
    GetMessagesUseCase,
    MarkMessagesAsReadUseCase,
  ],
})
export class MessagesModule {}
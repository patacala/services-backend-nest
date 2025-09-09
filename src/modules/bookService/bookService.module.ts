import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@/shared/shared.module';
import { BookServiceController } from './infrastructure/controllers/bookService.controller';
import { BookServiceRepository } from './domain/repositories/bookService.repository';
import { CreateBookServiceUseCase } from './application/use-cases/bookService';
import { PrismaBookServiceRepository } from './infrastructure/repositories/prisma-bookService.repository';


@Module({
  imports: [
    ConfigModule,
    SharedModule,
  ],
  controllers: [BookServiceController],
  providers: [
    {
      provide: BookServiceRepository,
      useClass: PrismaBookServiceRepository,
    },
    CreateBookServiceUseCase,
  ],
  exports: [BookServiceRepository],
})
export class BookServiceModule {}

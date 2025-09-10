import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@/shared/shared.module';
import { BookServiceController } from './infrastructure/controllers/bookService.controller';
import { BookServiceRepository } from './domain/repositories/bookService.repository';
import { CreateBookServiceUseCase } from './application/use-cases/createBookService';
import { PrismaBookServiceRepository } from './infrastructure/repositories/prisma-bookService.repository';
import { GetUserBookServicesUseCase } from './application/use-cases/getUserBookServices';


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
    GetUserBookServicesUseCase
  ],
  exports: [BookServiceRepository],
})
export class BookServiceModule {}

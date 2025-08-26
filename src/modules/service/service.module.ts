import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@/shared/shared.module';

import { PrismaServiceRepository } from './infrastructure/repositories/prisma-service.repository';
import { ServiceRepository } from './domain/repositories/service.repository';
import { CreateServiceUseCase } from './application/use-cases/createService';
import { ServiceController } from './infrastructure/controllers/service.controller';
import { GetUserServicesUseCase } from './application/use-cases/getUserServices';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
  ],
  controllers: [ServiceController],
  providers: [
    {
      provide: ServiceRepository,
      useClass: PrismaServiceRepository,
    },
    CreateServiceUseCase,
    GetUserServicesUseCase
  ],
  exports: [ServiceRepository],
})
export class ServiceModule {}

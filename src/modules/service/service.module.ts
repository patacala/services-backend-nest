import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from '@/shared/shared.module';

import { PrismaServiceRepository } from './infrastructure/repositories/prisma-service.repository';
import { ServiceRepository } from './domain/repositories/service.repository';
import { CreateServiceUseCase } from './application/use-cases/createService';
import { ServiceController } from './infrastructure/controllers/service.controller';
import { GetUserServicesUseCase } from './application/use-cases/getUserServices';
import { UpdateServiceUseCase } from './application/use-cases/UpdateService';
import { GetListServicesUseCase } from './application/use-cases/listServices';
import { CreateAccountProvServiceUseCase } from './application/use-cases/createAccountProvService';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        secret: c.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [ServiceController],
  providers: [
    {
      provide: ServiceRepository,
      useClass: PrismaServiceRepository,
    },
    CreateServiceUseCase,
    UpdateServiceUseCase,
    GetListServicesUseCase,
    GetUserServicesUseCase,
    CreateAccountProvServiceUseCase
  ],
  exports: [
    ServiceRepository,
    JwtModule
  ],
})
export class ServiceModule {}

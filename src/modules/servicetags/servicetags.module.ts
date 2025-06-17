import { Module } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { GetAllServicetagsUseCase } from './application/use-cases/get-all-servicetags.use-case';
import { ServicetagController } from './infrastructure/controllers/servicetag.controller';
import { PrismaServicetagRepository } from './infrastructure/repositories/prisma-servicetag.repository';
import { ServicetagRepository } from './domain/servicetag.repository';

@Module({
  controllers: [ServicetagController],
  providers: [
    PrismaService,
    GetAllServicetagsUseCase,
    {
      provide: ServicetagRepository,
      useClass: PrismaServicetagRepository,
    },
  ],
})
export class ServicetagModule {}

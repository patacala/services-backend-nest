import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { UpdateProfileUseCase } from './application/use-cases/update-profile';
import { PrismaService } from '@/shared/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UpdateProfileUseCase, PrismaService],
})
export class UsersModule {}

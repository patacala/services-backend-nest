import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { JwtStrategy } from './infrastructure/guards/jwt.strategy';
import { SharedModule } from '@/shared/shared.module';
import { LoginUseCase } from './application/use-cases/login';
import { RegisterDto } from './infrastructure/dtos/register.dto';

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
  controllers: [AuthController],
  providers: [
    PrismaUserRepository,
    RegisterUserUseCase,
    LoginUseCase,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}

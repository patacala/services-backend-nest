import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { RequestOtpUseCase } from './application/use-cases/request-otp';
import { VerifyOtpInitialUseCase } from './application/use-cases/verify-otp-initial';
import { VerifyOtpSimpleUseCase } from './application/use-cases/verify-otp-simple';
import { RegisterUserUseCase } from './application/use-cases/register';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { JwtStrategy } from './infrastructure/guards/jwt.strategy';
import { SharedModule } from '@/shared/shared.module';
import { LoginUseCase } from './application/use-cases/login';
import { ChangePasswordWithTokenUseCase } from './application/use-cases/change-password-with-token';
import { RequestOtpRecoveryUseCase } from './application/use-cases/request-otp-recovery';

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
    RequestOtpUseCase,
    RequestOtpRecoveryUseCase,
    VerifyOtpInitialUseCase,
    VerifyOtpSimpleUseCase,  
    RegisterUserUseCase,
    ChangePasswordWithTokenUseCase,
    LoginUseCase,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}

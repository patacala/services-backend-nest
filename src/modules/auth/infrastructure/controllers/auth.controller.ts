import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RequestOtpDto } from '../dtos/request-otp.dto';
import { VerifyOtpInitialDto } from '../dtos/verify-otp-initial.dto';
import { VerifyOtpSimpleDto } from '../dtos/verify-otp-simple.dto';
import { RegisterUserDto } from '../dtos/register.dto';
import { RequestOtpUseCase } from '../../application/use-cases/request-otp';
import { VerifyOtpInitialUseCase } from '../../application/use-cases/verify-otp-initial';
import { VerifyOtpSimpleUseCase } from '../../application/use-cases/verify-otp-simple';
import { RegisterUserUseCase } from '../../application/use-cases/register';
import { LoginDto } from '../dtos/login.dto';
import { LoginUseCase } from '../../application/use-cases/login';
import { ChangePasswordWithTokenDto } from '../dtos/change-password-with-token.dto';
import { ChangePasswordWithTokenUseCase } from '../../application/use-cases/change-password-with-token';
import { RequestOtpRecoveryDto } from '../dtos/request-otp-recovery.dto';
import { RequestOtpRecoveryUseCase } from '../../application/use-cases/request-otp-recovery';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly requestOtpUC: RequestOtpUseCase,
    private readonly requestOtpRecoveryUC: RequestOtpRecoveryUseCase,
    private readonly verifyOtpInitialUC: VerifyOtpInitialUseCase,
    private readonly verifyOtpSimpleUC: VerifyOtpSimpleUseCase,
    private readonly registerUserUC: RegisterUserUseCase,
    private readonly changePasswordWithTokenUC: ChangePasswordWithTokenUseCase,
    private readonly loginUC: LoginUseCase
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUC.execute(dto);
    return { message: 'Usuario creado', user };
  }

  @Post('request-otp')
  async requestOtp(@Body() dto: RequestOtpDto) {
    await this.requestOtpUC.execute(dto.userId, dto.phonenumber);
    return { message: 'OTP enviado por SMS' };
  }

  @Post('request-otp-recovery')
  async requestOtpRecovery(@Body() dto: RequestOtpRecoveryDto) {
    return this.requestOtpRecoveryUC.execute(dto.phonenumber);
  }

  @Post('verify-otp-initial')
  async verifyOtp(@Body() dto: VerifyOtpInitialDto) {
    const { token, user } = await this.verifyOtpInitialUC.execute(dto);
    return { message: 'OTP verificado correctamente', user, token };
  }

  @Post('verify-otp-simple')
  async verifyOtpSimple(@Body() dto: VerifyOtpSimpleDto) {
    const { recoveryToken } = await this.verifyOtpSimpleUC.execute(dto);
    return { message: 'OTP verificado correctamente', recoveryToken };
  }

  @Post('change-password-with-token')
  async changePasswordWithToken(@Body() dto: ChangePasswordWithTokenDto) {
    return this.changePasswordWithTokenUC.execute(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUC.execute(dto);
  }
}

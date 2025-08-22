import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register';
import { LoginUseCase } from '../../application/use-cases/login';
import { FirebaseAuthGuard } from '@/shared/firebase/firebase-auth.guard';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUC: RegisterUserUseCase,
    private readonly loginUC: LoginUseCase
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('login')
  async firebaseLogin(@Req() req) {
    return this.loginUC.loginWithFirebase(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUserUC.execute(dto);
  }
}

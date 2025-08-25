import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register';
import { LoginUseCase } from '../../application/use-cases/login';
import { FirebaseAuthGuard } from '@/shared/firebase/firebase-auth.guard';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile';
import { GetProfileUseCase } from '../../application/use-cases/profile';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly registerUserUC: RegisterUserUseCase,
    private readonly getProfileUC: GetProfileUseCase,
    private readonly updateProfileUC: UpdateProfileUseCase,
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req) {
    const userId = req.user.id;
    return this.getProfileUC.execute(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.updateProfileUC.execute(userId, dto);
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FirebaseLoginDto } from '../dtos/firebase-login.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register';
import { LoginUseCase } from '../../application/use-cases/login';
import { FirebaseAuthGuard } from '@/shared/firebase/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUC: RegisterUserUseCase,
    private readonly loginUC: LoginUseCase
  ) {}

/*   @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUC.execute(dto);
    return { message: 'Usuario creado', user };
  } */

  @UseGuards(FirebaseAuthGuard)
  @Post('login')
  async firebaseLogin(@Body() dto: FirebaseLoginDto) {
    return this.loginUC.loginWithFirebase(dto.firebaseToken);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register.dto';
import { FirebaseLoginDto } from '../dtos/firebase-login.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register';
import { LoginUseCase } from '../../application/use-cases/login';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUC: RegisterUserUseCase,
    private readonly loginUC: LoginUseCase
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUC.execute(dto);
    return { message: 'Usuario creado', user };
  }

  @Post('firebase-login')
  async firebaseLogin(@Body() dto: FirebaseLoginDto) {
    console.log(dto.firebaseToken);
    return this.loginUC.loginWithFirebase(dto.firebaseToken);
  }
}

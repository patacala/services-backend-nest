import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordWithTokenDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  repeatPassword: string;
}

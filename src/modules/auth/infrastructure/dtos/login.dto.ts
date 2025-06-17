import { IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Número telefónico inválido.',
  })
  phonenumber: string;

  @IsNotEmpty()
  password: string;
}

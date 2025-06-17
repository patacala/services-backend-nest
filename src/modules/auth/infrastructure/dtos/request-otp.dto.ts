import { IsInt, IsNotEmpty, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Número telefónico inválido.',
  })
  phonenumber: string;
}

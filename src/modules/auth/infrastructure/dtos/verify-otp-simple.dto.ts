import { IsNotEmpty } from 'class-validator';

export class VerifyOtpSimpleDto {
  @IsNotEmpty()
  phonenumber: string;

  @IsNotEmpty()
  code: string;
}

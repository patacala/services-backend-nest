import { IsNotEmpty } from 'class-validator';

export class RequestOtpRecoveryDto {
  @IsNotEmpty()
  phonenumber: string;
}

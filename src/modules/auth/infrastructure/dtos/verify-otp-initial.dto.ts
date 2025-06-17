import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyOtpInitialDto {
  @IsInt()
  userId: number;

  @IsNotEmpty()
  code: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  @IsArray()
  servicetagids?: number[];
}

import { IsNotEmpty, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  phonenumber: string;

  @IsNotEmpty()
  city: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  service_ids: number[];
}

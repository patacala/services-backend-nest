import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'La ciudad no puede superar los 50 caracteres.' })
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres.' })
  @MaxLength(100, { message: 'La dirección no puede superar los 100 caracteres.' })
  address?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

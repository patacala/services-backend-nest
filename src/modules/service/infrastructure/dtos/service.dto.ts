// src/service/application/dto/create-service.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  Matches,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: 'El título debe ser un texto válido' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString({ message: 'La descripción debe ser un texto válido' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio base debe ser un número válido' })
  @Min(0, { message: 'El precio base no puede ser negativo' })
  price?: number;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/, {
    message: 'La moneda debe ser un código ISO de 3 letras en mayúsculas (ej: USD, EUR)',
  })
  currency?: string;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un texto válido' })
  city?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un número válido' })
  @Min(-90, { message: 'La latitud mínima es -90' })
  @Max(90, { message: 'La latitud máxima es 90' })
  lat?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un número válido' })
  @Min(-180, { message: 'La longitud mínima es -180' })
  @Max(180, { message: 'La longitud máxima es 180' })
  lon?: number;

  /* @IsNotEmpty({ message: 'Cover media ID is required' })
  @IsString({ message: 'Cover media ID must be a string' }) */
  coverMediaId: string;

  @IsOptional()
  @IsArray({ message: 'Las categorías deben enviarse en un arreglo' })
  @ArrayNotEmpty({ message: 'Debes seleccionar al menos una categoría' })
  @IsString({ each: true, message: 'Cada categoría debe ser un string válido' })
  categoryIds?: string[];
}

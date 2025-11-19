import { MediaKind } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class MediaDto {
  @IsString()
  filename: string;

  @IsString()
  id: string;

  @IsBoolean()
  @IsOptional()
  downloaded?: boolean;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de archivo es obligatorio' })
  kind?: MediaKind;

  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Cada variante debe ser una URL de texto válida' })
  variants?: string[];
}

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  bookServiceId: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsArray({ message: 'Los medios deben enviarse en un array' })
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
}

export class GetMessagesDto {
  @IsNotEmpty()
  @IsUUID()
  bookServiceId: string;
}
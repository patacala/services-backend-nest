import { MediaKind } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';

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

  @ValidateIf((o) => !o.media || o.media.length === 0)
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío si no se envían imágenes' })
  @IsString()
  message: string;

  @ValidateIf((o) => !o.message)
  @IsArray({ message: 'Los medios deben enviarse en un array' })
  @ArrayMinSize(1, { message: 'Debe enviarse al menos una imagen si no hay mensaje' })
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
}

export class GetMessagesDto {
  @IsNotEmpty()
  @IsUUID()
  bookServiceId: string;
}
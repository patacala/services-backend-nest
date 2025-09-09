import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateBookServiceDto {
  @IsString({ message: 'El ID del servicio debe ser un texto válido' })
  @IsNotEmpty({ message: 'El ID del servicio es obligatorio' })
  serviceId: string;

  @IsString({ message: 'El nombre del servicio debe ser un texto válido' })
  @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
  serviceName: string;

  @IsDateString({}, { message: 'La fecha debe ser una fecha válida en formato ISO' })
  @IsNotEmpty({ message: 'La fecha y hora son obligatorias' })
  dateTime: Date;

  @IsString({ message: 'La dirección debe ser un texto válido' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @IsOptional()
  @IsString({ message: 'El comentario debe ser un texto válido' })
  comments?: string;

  @IsString({ message: 'El nombre del responsable debe ser un texto válido' })
  @IsNotEmpty({ message: 'El nombre del responsable es obligatorio' })
  responsibleName: string;

  @IsString({ message: 'El número de celular debe ser un texto válido' })
  @IsNotEmpty({ message: 'El número de celular es obligatorio' })
  phoneNumber: string;
}
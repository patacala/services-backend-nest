import {
  IsString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateFavoriteDto {
  user_id: string;

  @IsString({ message: 'Service ID must be a valid string' })
  @IsNotEmpty({ message: 'Service ID is required' })
  @IsUUID('4', { message: 'Service ID must be a valid UUID' })
  service_id: string;
}

export class DeleteFavoriteDto {
  user_id: string;

  @IsString({ message: 'Service ID must be a valid string' })
  @IsNotEmpty({ message: 'Service ID is required' })
  @IsUUID('4', { message: 'Service ID must be a valid UUID' })
  service_id: string;
}
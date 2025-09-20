import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

export class ListImagesDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  per_page?: number;

  @IsOptional()
  @IsIn(['created', 'uploaded', 'id'])
  order?: 'created' | 'uploaded' | 'id';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  direction?: 'asc' | 'desc';
}

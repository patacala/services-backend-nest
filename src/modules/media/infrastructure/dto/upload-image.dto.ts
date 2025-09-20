import { Transform } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class UploadImageQueryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  requireSignedURLs?: boolean;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    }
    return value;
  })
  metadata?: Record<string, any>;
}

import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  requireSignedURLs?: boolean;
}

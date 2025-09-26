import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class WatermarkDto {
  @IsString()
  uid!: string;
}

export class DirectUploadVideoDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxDurationSeconds?: number;

  @IsOptional()
  @IsString()
  creator?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedOrigins?: string[];

  @IsOptional()
  @IsBoolean()
  requireSignedURLs?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  thumbnailTimestampPct?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => WatermarkDto)
  watermark?: WatermarkDto | null;

  @IsOptional()
  // free-form metadata
  meta?: Record<string, any>;
}

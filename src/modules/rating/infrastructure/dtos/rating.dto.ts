import { 
  IsString, 
  IsNotEmpty, 
  IsUUID, 
  IsInt, 
  Min, 
  Max, 
  IsOptional, 
  IsEnum 
} from 'class-validator';

export enum RatingVisibility {
  PUBLIC = 'public',
  HIDDEN = 'hidden'
}

export class CreateRatingDto {
  @IsNotEmpty()
  @IsUUID()
  ratedUserId: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Score must be at least 1' })
  @Max(5, { message: 'Score must be at most 5' })
  score: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(RatingVisibility)
  visibility?: RatingVisibility;
}

export class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  score?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(RatingVisibility)
  visibility?: RatingVisibility;
}

export class GetRatingsQueryDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsEnum(RatingVisibility)
  visibility?: RatingVisibility;
}
import { IsNotEmpty, IsEmail, IsArray, Matches, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'UserID must be a string' })
  userId: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Invalid phone number.',
  })
  phone: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsArray({ message: 'Selected categories must be an array' })
  @IsString({ each: true, message: 'Each category must be a valid ID' })
  selectedCategories?: string[];
}
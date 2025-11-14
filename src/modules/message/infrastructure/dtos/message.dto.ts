import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  bookServiceId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class GetMessagesDto {
  @IsNotEmpty()
  @IsUUID()
  bookServiceId: string;
}
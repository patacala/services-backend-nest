import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { DirectUploadVideoDto } from '../dto/direct-upload-video.dto';
import { GenerateDirectUploadUrlUseCase } from '../../application/use-cases/videos/generateDirectUploadUrl';

// @UseGuards(JwtAuthGuard)
@Controller('media/videos')
export class VideosController {
  constructor(private readonly generateDirectUrl: GenerateDirectUploadUrlUseCase) {}

  @Post('direct-upload-url')
  async createDirectUploadUrl(
    @Body(new ValidationPipe({ transform: true })) body: DirectUploadVideoDto,
  ) {
    const result = await this.generateDirectUrl.execute(body);
    // Standardize the response to expose uploadURL and uid explicitly
    return {
      uploadURL: result?.uploadURL,
      uid: result?.uid,
      result,
    };
  }
}

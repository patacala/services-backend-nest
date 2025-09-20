import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { UploadImageUseCase } from '../../application/use-cases/uploadImage';
import { UpdateImageUseCase } from '../../application/use-cases/updateImage';
import { GetImageDetailsUseCase } from '../../application/use-cases/getImageDetails';
import { DeleteImageUseCase } from '../../application/use-cases/deleteImage';
import { ListImagesUseCase } from '../../application/use-cases/listImages';
import { UploadImageQueryDto } from '../dto/upload-image.dto';
import { UpdateImageDto } from '../dto/update-image.dto';
import { ListImagesDto } from '../dto/list-images.dto';

@Controller('media/images')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(
    private readonly uploadImage: UploadImageUseCase,
    private readonly updateImage: UpdateImageUseCase,
    private readonly getDetails: GetImageDetailsUseCase,
    private readonly deleteImage: DeleteImageUseCase,
    private readonly listImages: ListImagesUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query(new ValidationPipe({ transform: true })) query: UploadImageQueryDto,
  ) {
    if (!file?.buffer || !file?.originalname) {
      throw new Error('File is required in multipart/form-data with field name "file"');
    }

    return this.uploadImage.execute({
      buffer: file.buffer,
      filename: file.originalname,
      id: query.id,
      requireSignedURLs: query.requireSignedURLs,
      metadata: query.metadata,
    });
  }

  @Get()
  async list(@Query(new ValidationPipe({ transform: true })) query: ListImagesDto) {
    return this.listImages.execute(query);
  }

  @Get(':id')
  async details(@Param('id') id: string) {
    return this.getDetails.execute(id);
    }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) body: UpdateImageDto,
  ) {
    return this.updateImage.execute({ imageId: id, ...body });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deleteImage.execute(id);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@/shared/shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaController } from './infrastructure/controllers/media.controller';
import { UploadImageUseCase } from './application/use-cases/uploadImage';
import { UpdateImageUseCase } from './application/use-cases/updateImage';
import { GetImageDetailsUseCase } from './application/use-cases/getImageDetails';
import { DeleteImageUseCase } from './application/use-cases/deleteImage';
import { ListImagesUseCase } from './application/use-cases/listImages';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [MediaController],
  providers: [
    UploadImageUseCase,
    UpdateImageUseCase,
    GetImageDetailsUseCase,
    DeleteImageUseCase,
    ListImagesUseCase,
  ],
})
export class MediaModule {}

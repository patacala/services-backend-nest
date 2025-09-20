import { Injectable } from '@nestjs/common';
import { CloudflareImagesService } from '@/shared/cloudflare/images';

@Injectable()
export class GetImageDetailsUseCase {
  constructor(private readonly cf: CloudflareImagesService) {}

  async execute(imageId: string) {
    return this.cf.getImageDetails(imageId);
  }
}

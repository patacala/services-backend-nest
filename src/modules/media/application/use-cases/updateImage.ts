import { Injectable } from '@nestjs/common';
import { CloudflareImagesService } from '@/shared/cloudflare/images';

export interface UpdateImageCommand {
  imageId: string;
  metadata?: Record<string, any>;
  requireSignedURLs?: boolean;
}

@Injectable()
export class UpdateImageUseCase {
  constructor(private readonly cf: CloudflareImagesService) {}

  async execute(cmd: UpdateImageCommand) {
    return this.cf.updateImage(cmd.imageId, {
      metadata: cmd.metadata,
      requireSignedURLs: cmd.requireSignedURLs,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CloudflareImagesService } from '@/shared/cloudflare/images';

export interface UploadImageCommand {
  buffer: Buffer;
  filename: string;
  id?: string;
  requireSignedURLs?: boolean;
  metadata?: Record<string, any>;
}

@Injectable()
export class UploadImageUseCase {
  constructor(private readonly cf: CloudflareImagesService) {}

  async execute(cmd: UploadImageCommand) {
    return this.cf.uploadImage(cmd.buffer, cmd.filename, {
      id: cmd.id,
      requireSignedURLs: cmd.requireSignedURLs,
      metadata: cmd.metadata,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CloudflareStreamService } from '@/shared/cloudflare/stream';

export interface GenerateDirectUploadUrlInput {
  maxDurationSeconds?: number;
  creator?: string;
  allowedOrigins?: string[];
  requireSignedURLs?: boolean;
  thumbnailTimestampPct?: number;
  watermark?: { uid: string } | null;
  meta?: Record<string, any>;
}

@Injectable()
export class GenerateDirectUploadUrlUseCase {
  constructor(private readonly cfStream: CloudflareStreamService) {}

  async execute(input: GenerateDirectUploadUrlInput = {}) {
    return this.cfStream.createDirectUploadUrl(input);
  }
}

import { Injectable } from '@nestjs/common';
import { CloudflareImagesService } from '@/shared/cloudflare/images';

export interface ListImagesQuery {
  page?: number;
  per_page?: number;
  order?: 'created' | 'uploaded' | 'id';
  direction?: 'asc' | 'desc';
}

@Injectable()
export class ListImagesUseCase {
  constructor(private readonly cf: CloudflareImagesService) {}

  async execute(query: ListImagesQuery) {
    return this.cf.listImages(query);
  }
}

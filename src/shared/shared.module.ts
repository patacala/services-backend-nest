import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CloudflareImagesService } from './cloudflare/images';
import { CloudflareStreamService } from './cloudflare/stream';

@Module({
  providers: [PrismaService, CloudflareImagesService, CloudflareStreamService],
  exports: [PrismaService, CloudflareImagesService, CloudflareStreamService],
})
export class SharedModule {}

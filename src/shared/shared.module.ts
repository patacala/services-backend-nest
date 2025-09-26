import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { PrismaService } from './prisma.service';
import { CloudflareImagesService } from './cloudflare/images';
import { CloudflareStreamService } from './cloudflare/stream';

@Module({
  providers: [TwilioService, PrismaService, CloudflareImagesService, CloudflareStreamService],
  exports: [TwilioService, PrismaService, CloudflareImagesService, CloudflareStreamService],
})
export class SharedModule {}

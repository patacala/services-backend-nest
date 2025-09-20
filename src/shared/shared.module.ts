import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { PrismaService } from './prisma.service';
import { CloudflareImagesService } from './cloudflare/images';

@Module({
  providers: [TwilioService, PrismaService, CloudflareImagesService],
  exports: [TwilioService, PrismaService, CloudflareImagesService],
})
export class SharedModule {}

import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [TwilioService, PrismaService],
  exports: [TwilioService, PrismaService],
})
export class SharedModule {}

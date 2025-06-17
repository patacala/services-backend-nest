import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { TwilioService } from '@/shared/twilio.service';

@Injectable()
export class RequestOtpUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twilio: TwilioService
  ) {}

  async execute(userId: number, phonenumber: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpcode.create({
      data: {
        userid: userId,
        phonenumber,
        code,
        expiresat: expiresAt,
      },
    });

    await this.twilio.sendSms(phonenumber, `Tu código OTP es: ${code}`);
  }
}

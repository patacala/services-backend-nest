import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { TwilioService } from '@/shared/twilio.service';

@Injectable()
export class RequestOtpRecoveryUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twilio: TwilioService
) {}

  async execute(phonenumber: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { phonenumber },
    });

    if (!user) {
      throw new NotFoundException({ message: 'There is no user with that number' });
      
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await this.prisma.otpcode.create({
      data: {
        userid: user.id,
        phonenumber,
        code,
        expiresat: new Date(Date.now() + 5 * 60 * 1000),
        used: false,
      },
    });

    await this.twilio.sendSms(phonenumber, `Tu código OTP es: ${code}`);

    return { message: 'OTP de recuperación enviado por SMS' };
  }
}

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { VerifyOtpInitialDto } from '../../infrastructure/dtos/verify-otp-initial.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyOtpInitialUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: VerifyOtpInitialDto): Promise<{
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      phonenumber: string | null;
    };
  }> {
    const { userId, code, city, servicetagids } = dto;

    const otp = await this.prisma.otpcode.findFirst({
      where: {
        userid: userId,
        code,
        used: false,
        expiresat: {
          gt: new Date(),
        },
      },
    });

    if (!otp) {
      throw new UnauthorizedException('Código OTP inválido o expirado');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phonenumber: otp.phonenumber,
        city: city ?? undefined,
      },
    });

    if (servicetagids?.length) {
      await this.prisma.userservicetag.deleteMany({ where: { userid: userId } });

      for (const tagId of servicetagids) {
        await this.prisma.userservicetag.create({
          data: {
            userid: userId,
            servicetagid: parseInt(tagId.toString()),
          },
        });
      }
    }

    await this.prisma.otpcode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phonenumber: true,
      },
    });

    const token = this.jwtService.sign(
      {
        sub: updatedUser.id,
        email: updatedUser.email,
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      token,
      user: updatedUser,
    };
  }
}

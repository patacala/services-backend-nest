import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { VerifyOtpSimpleDto } from '../../infrastructure/dtos/verify-otp-simple.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyOtpSimpleUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: VerifyOtpSimpleDto): Promise<{
    recoveryToken: string;
  }> {
    const { phonenumber, code } = dto;

    // Busca el usuario por phonenumber
    const user = await this.prisma.user.findFirst({
      where: { phonenumber },
    });

    if (!user) throw new NotFoundException({ message: 'User not found' });

    // Busca OTP válido asociado al userId y número
    const otp = await this.prisma.otpcode.findFirst({
      where: {
        userid: user.id,
        phonenumber,
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

    // Marca OTP como usado
    await this.prisma.otpcode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Genera el token temporal
    const recoveryToken = this.jwtService.sign(
      {
        sub: user.id,
        type: 'password-recovery',
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '10m',
      },
    );

    return { recoveryToken };
  }
}

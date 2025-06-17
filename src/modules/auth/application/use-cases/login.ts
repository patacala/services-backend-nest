import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../infrastructure/dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async execute(dto: LoginDto) {
    const { phonenumber, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { phonenumber } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, phonenumber: user.phonenumber };

    const token = this.jwt.sign(payload);

    return {
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        phonenumber: user.phonenumber,
      },
    };
  }
}

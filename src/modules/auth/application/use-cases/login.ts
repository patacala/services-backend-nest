// src/auth/application/use-cases/login.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../infrastructure/dtos/login.dto';
import { admin } from '@/shared/firebase/firebase-admin.module';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async loginWithFirebase(firebaseToken: string) {
    try {
      const decoded = await admin.auth().verifyIdToken(firebaseToken);
      const { uid, email, phone_number } = decoded;

      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { firebaseuid: uid },
            { email: email ?? undefined },
          ],
        },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            firebaseuid: uid,
            email,
            phonenumber: phone_number ?? null,
            name: email ?? 'Firebase User',
          },
        });
      }

      const payload = { sub: user.id, phonenumber: user.phonenumber };
      const token = this.jwt.sign(payload);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phonenumber: user.phonenumber,
        },
      };
    } catch (error) {
      console.error('Error en loginWithFirebase:', error);
      throw new UnauthorizedException('Token de Firebase inválido o expirado');
    }
  }
}

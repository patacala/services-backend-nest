// src/auth/application/use-cases/login.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async loginWithFirebase(decoded: any) {
    try {
      // Obtener información del token de Firebase
      const { uid, email, phone_number, name } = decoded;
      let isNewUser = true;

      // Buscar usuario por firebase_uid o email o phone
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { firebaseUid: uid },
            { email: email ?? undefined },
            { phone: phone_number ?? undefined },
          ],
        },
      });

      // Si no existe, crearlo
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            firebaseUid: uid,
            email: email ?? null,
            phone: phone_number ?? null,
            displayName: name ?? null,
            role: 'seeker',
          },
        });
      } else {
        isNewUser = false;
      }

      // Crear payload del JWT, vence en 7 dias
      const payload = { sub: user.id, role: user.role };
      const token = this.jwt.sign(payload, { expiresIn: '7d' });

      return {
        token,
        user: {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isNewUser
        },
      };
    } catch (error) {
      console.error('Error en loginWithFirebase:', error);
      throw new UnauthorizedException('Error al validad OTP, intentelo de nuevo.');
    }
  }
}

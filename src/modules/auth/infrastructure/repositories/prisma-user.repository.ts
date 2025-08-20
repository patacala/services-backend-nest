import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<User>): Promise<User> {
    const u = await this.prisma.user.create({
      data: {
        firebaseUid: data.firebaseUid!,
        email: data.email ?? null,
        phone: data.phone ?? null,
        displayName: data.displayName ?? null,
        role: data.role || 'seeker'
      },
    });
    return new User(u.id, u.firebaseUid, u.email, u.phone, u.displayName, u.role, u.createdAt, u.updatedAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = await this.prisma.user.findUnique({ where: { email } });

    if (!u) return null;
    return new User(u.id, u.firebaseUid, u.email, u.phone, u.displayName, u.role, u.createdAt, u.updatedAt);
  }
}
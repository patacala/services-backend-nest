import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<User>): Promise<User> {
    const u = await this.prisma.user.create({
      data: {
        firebase_uid: data.firebaseUid!,
        email: data.email!,
        display_name: data.displayName!,
        role: data.role || 'seeker'
      },
    });
    return new User(u.id, u.firebase_uid, u.email, u.display_name, u.role, u.created_at, u.updated_at);
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) return null;
    return new User(u.id, u.firebase_uid, u.email, u.display_name, u.role, u.created_at, u.updated_at);
  }
}
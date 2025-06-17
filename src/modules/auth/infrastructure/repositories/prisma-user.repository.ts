import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<User>): Promise<User> {
    const hashed = await bcrypt.hash(data.password!, 10);
    const u = await this.prisma.user.create({
      data: {
        name: data.name!,
        email: data.email!,
        password: hashed,
      },
    });
    return new User(u.id, u.name, u.email, u.password);
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) return null;
    return new User(u.id, u.name, u.email, u.password);
  }
}

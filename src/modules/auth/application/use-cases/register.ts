import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';
import { User } from '../../domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: PrismaUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: { name: string; email: string; }): Promise<{ user: User; token: string }> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.userRepo.create(data);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.displayName,
    });

    return { user, token };
  }
}

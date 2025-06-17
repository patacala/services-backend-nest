import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateProfileDto } from '../../infrastructure/dtos/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: number, dto: UpdateProfileDto) {
    const exists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!exists) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phonenumber: dto.phonenumber,
        city: dto.city,
      },
    });

    await this.prisma.userservicetag.deleteMany({ where: { userid: userId } });

    for (const sid of dto.service_ids) {
      await this.prisma.userservicetag.create({
        data: { userid: userId, servicetagid: sid },
      });
    }

    return { message: 'Profile updated' };
  }
}

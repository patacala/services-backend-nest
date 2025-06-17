import {
  Controller,
  Patch,
  Body,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UpdateProfileUseCase } from '@/modules/user/application/use-cases/update-profile';
import { PrismaService } from '@/shared/prisma.service';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly updateProfileUC: UpdateProfileUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Req() req, @Body() dto: UpdateProfileDto) {
    const userId = req.user.sub as number;
    return this.updateProfileUC.execute(userId, dto);
  }

  @Get('services')
  async getServices() {
    const services = await this.prisma.servicetag.findMany({
      select: { id: true, name: true, icon: true },
    });
    return services;
  }
}

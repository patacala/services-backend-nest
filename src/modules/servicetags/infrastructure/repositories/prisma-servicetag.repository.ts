import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { ServicetagRepository, Servicetag } from '../../domain/servicetag.repository';

@Injectable()
export class PrismaServicetagRepository implements ServicetagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Servicetag[]> {
    return this.prisma.servicetag.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });
  }
}

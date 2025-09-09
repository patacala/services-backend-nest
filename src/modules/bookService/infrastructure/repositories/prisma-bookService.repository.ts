import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { BookServiceRepository } from '../../domain/repositories/bookService.repository';
import { BookServiceEntity } from '../../domain/entities/bookService.entity';
import { BookServiceStatus } from '@prisma/client';

@Injectable()
export class PrismaBookServiceRepository implements BookServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<BookServiceEntity>): Promise<BookServiceEntity> {
    const booking = await this.prisma.bookService.create({
      data: {
        service_id: data.service_id,
        user_id: data.user_id,
        service_name: data.service_name,
        date_time: data.date_time,
        address: data.address,
        comments: data.comments ?? null,
        responsible_name: data.responsible_name!,
        phone_number: data.phone_number!,
        status: BookServiceStatus.pending,
      },
    });

    return this.mapToEntity(booking);
  }

  private mapToEntity(booking: any): BookServiceEntity {
    return new BookServiceEntity(
      booking.id,
      booking.service_id,
      booking.user_id,
      booking.service_name,
      booking.date_time,
      booking.address,
      booking.comments,
      booking.responsible_name,
      booking.phone_number,
      booking.status,
      booking.created_at,
      booking.updated_at,
    );
  }
}

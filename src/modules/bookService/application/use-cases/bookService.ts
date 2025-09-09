import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateBookServiceDto } from '../../infrastructure/dtos/bookService.dto';

@Injectable()
export class CreateBookServiceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateBookServiceDto) {
    try {
      if (!dto.serviceId) {
        throw new BadRequestException('Service ID is required');
      }
      if (!dto.dateTime || !dto.address) {
        throw new BadRequestException('Date/time and address are required');
      }
      if (!dto.responsibleName || !dto.phoneNumber) {
        throw new BadRequestException('Responsible name and phone number are required');
      }

      const booking = await this.prisma.bookService.create({
        data: {
          service_id: dto.serviceId,
          service_name: dto.serviceName,
          user_id: userId,
          date_time: dto.dateTime,
          address: dto.address,
          comments: dto.comments ?? null,
          responsible_name: dto.responsibleName,
          phone_number: dto.phoneNumber,
          status: 'pending',
        },
        include: {
          service: true,
          user: true,
        },
      });

      return {
        id: booking.id,
        serviceId: booking.service_id,
        serviceName: booking.service_name,
        userId: booking.user_id,
        dateTime: booking.date_time,
        address: booking.address,
        comments: booking.comments,
        responsibleName: booking.responsible_name,
        phoneNumber: booking.phone_number,
        status: booking.status,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create book service');
    }
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetUserBookServicesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    try {
      const bookings = await this.prisma.bookService.findMany({
        where: {
          user_id: userId,
        },
        include: {
          service: {
            include: {
              categories: {
                include: { category: true },
              },
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return bookings.map((booking) => ({
        id: booking.id,
        serviceId: booking.service_id,
        serviceName: booking.service_name,
        userId: booking.user_id,
        dateTime: booking.date_time,
        dateShort: booking.date_time.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        }),
        timeShort: booking.date_time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        }),
        address: booking.address,
        comments: booking.comments,
        responsibleName: booking.responsible_name,
        phoneNumber: booking.phone_number,
        status: booking.status,
        provider: {
          id: booking.service.user.id,
          name: booking.service.user.profile?.name ?? '',
        },
        categories: booking.service.categories.map((sc) =>
          sc.category.id.toString(),
        ),
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching user book services:', error);
      throw new BadRequestException('Failed to fetch user book services');
    }
  }
}

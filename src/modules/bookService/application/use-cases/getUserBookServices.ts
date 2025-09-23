import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetUserBookServicesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    try {
      // Obtener información del usuario consultado
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const bookings = await this.prisma.bookService.findMany({
        where: {
          OR: [
            { user_id: userId }, // Reservas que hizo el usuario
            { service: { user_id: userId } }, // Reservas de servicios del usuario
          ],
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
          user: {
            include: {
              profile: true,
            },
          },
        },
      });

      // Mapear todas las reservas
      const mappedBookings = bookings.map((booking) => {
        const isMyBooking = booking.user_id === userId;
        
        return {
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
          role: user.role,
          bookingType: isMyBooking ? 'client' : 'provider',
          provider: {
            id: booking.service.user.id,
            name: booking.service.user.profile?.name ?? '',
          },
          client: {
            id: booking.user.id,
            name: booking.user.profile?.name ?? '',
            role: booking.user.role,
          },
          categories: booking.service.categories.map((sc) =>
            sc.category.id.toString(),
          ),
          createdAt: booking.created_at,
          updatedAt: booking.updated_at,
        };
      });

      // Separar las reservas en dos arrays
      const myBookings = mappedBookings.filter(booking => booking.bookingType === userId);
      const otherBookings = mappedBookings.filter(booking => booking.userId !== userId);

      // Función para ordenar: pendientes primero, luego por fecha de creación (más reciente primero)
      const sortBookings = (bookings: any) => {
        return bookings.sort((a: any, b: any) => {
          // Primero ordenar por estado (pendientes primero)
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          
          // Si tienen el mismo estado, ordenar por fecha de creación (más reciente primero)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      };

      return {
        myBookings: sortBookings(myBookings),
        otherBookings: sortBookings(otherBookings),
      };
    } catch (error) {
      console.error('Error fetching user book services:', error);
      throw new BadRequestException('Failed to fetch user book services');
    }
  }
}
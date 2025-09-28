import { PrismaService } from '@/shared/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type MediaFile = Prisma.MediaFileGetPayload<{}>;

@Injectable()
export class GetUserBookServicesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  private mapProfileMedia(files: MediaFile[] | undefined): Record<string, { url: string }> | null {
    if (!files || files.length === 0) {
      return null;
    }

    return files.reduce((acc, file) => {
      acc[file.type_variant] = { url: file.url };
      return acc;
    }, {} as Record<string, { url: string }>);
  }

  async execute(userId: string) {
    try {
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
            { user_id: userId },
            { service: { user_id: userId } },
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
                  profile: {
                    include: {
                      media_link: {
                        include: {
                          files: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          user: {
            include: {
              profile: {
                include: {
                  media_link: {
                    include: {
                      files: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const mappedBookings = bookings.map((booking) => {
        const isMyBooking = booking.user_id === userId;
        
        const providerMedia = this.mapProfileMedia(booking.service.user.profile?.media_link?.files);
        const clientMedia = this.mapProfileMedia(booking.user.profile?.media_link?.files);
        
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
            media: providerMedia,
          },
          client: {
            id: booking.user.id,
            name: booking.user.profile?.name ?? '',
            role: booking.user.role,
            media: clientMedia,
          },
          categories: booking.service.categories.map((sc) =>
            sc.category.id.toString(),
          ),
          createdAt: booking.created_at,
          updatedAt: booking.updated_at,
        };
      });

      const myBookings = mappedBookings.filter(booking => booking.userId === userId);
      const otherBookings = mappedBookings.filter(booking => booking.userId !== userId);

      const sortBookings = (bookings: any) => {
        return bookings.sort((a: any, b: any) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          
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
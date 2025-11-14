import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetMessagesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, bookServiceId: string) {
    try {
      // Verificar que el booking existe y el usuario es parte de él
      const booking = await this.prisma.bookService.findUnique({
        where: { id: bookServiceId },
        include: {
          service: {
            select: { user_id: true }
          }
        }
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      const isClient = booking.user_id === userId;
      const isProvider = booking.service.user_id === userId;

      if (!isClient && !isProvider) {
        throw new ForbiddenException('You are not authorized to view these messages');
      }

      // Obtener los mensajes
      const messages = await this.prisma.bookServiceMessage.findMany({
        where: {
          book_service_id: bookServiceId,
        },
        include: {
          sender: {
            select: {
              id: true,
              displayName: true,
              profile: {
                select: {
                  name: true,
                  media_link: {
                    select: {
                      files: {
                        where: {
                          type_variant: 'profileThumbnail'
                        },
                        select: {
                          url: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      });

      return messages.map(msg => ({
        id: msg.id,
        bookServiceId: msg.book_service_id,
        senderId: msg.sender_id,
        message: msg.message,
        createdAt: msg.created_at,
        readAt: msg.read_at,
        isOwn: msg.sender_id === userId,
        sender: {
          id: msg.sender.id,
          name: msg.sender.profile?.name || msg.sender.displayName,
          avatar: msg.sender.profile?.media_link?.files[0]?.url || null,
        }
      }));
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error getting messages:', error);
      throw new BadRequestException('Failed to get messages');
    }
  }
}
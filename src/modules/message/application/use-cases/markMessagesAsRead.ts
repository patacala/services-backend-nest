import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class MarkMessagesAsReadUseCase {
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
        throw new ForbiddenException('You are not authorized to mark messages as read');
      }

      // Marcar como leídos todos los mensajes que no son del usuario actual
      await this.prisma.bookServiceMessage.updateMany({
        where: {
          book_service_id: bookServiceId,
          sender_id: {
            not: userId
          },
          read_at: null
        },
        data: {
          read_at: new Date()
        }
      });

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error marking messages as read:', error);
      throw new BadRequestException('Failed to mark messages as read');
    }
  }
}
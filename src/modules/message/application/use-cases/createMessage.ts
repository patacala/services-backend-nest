import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateMessageDto } from '../../infrastructure/dtos/message.dto';

@Injectable()
export class CreateMessageUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateMessageDto) {
    try {
      // Verificar que el booking existe y el usuario es parte de él
      const booking = await this.prisma.bookService.findUnique({
        where: { id: dto.bookServiceId },
        include: {
          service: {
            select: { user_id: true }
          }
        }
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      // Verificar que el usuario es el cliente o el proveedor
      const isClient = booking.user_id === userId;
      const isProvider = booking.service.user_id === userId;

      if (!isClient && !isProvider) {
        throw new ForbiddenException('You are not authorized to send messages in this chat');
      }

      // Verificar que el booking no esté rechazado o cancelado
      if (booking.status === 'rejected' || booking.status === 'cancelled') {
        throw new BadRequestException('Cannot send messages to a rejected or cancelled booking');
      }

      // Crear el mensaje
      const message = await this.prisma.bookServiceMessage.create({
        data: {
          book_service_id: dto.bookServiceId,
          sender_id: userId,
          message: dto.message,
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
        }
      });

      return {
        id: message.id,
        bookServiceId: message.book_service_id,
        senderId: message.sender_id,
        message: message.message,
        createdAt: message.created_at,
        readAt: message.read_at,
        sender: {
          id: message.sender.id,
          name: message.sender.profile?.name || message.sender.displayName,
          avatar: message.sender.profile?.media_link?.files[0]?.url || null,
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error creating message:', error);
      throw new BadRequestException('Failed to create message');
    }
  }
}
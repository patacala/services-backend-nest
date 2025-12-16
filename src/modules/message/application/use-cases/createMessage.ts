import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateMessageDto } from '../../infrastructure/dtos/message.dto';
import { MediaKind, MediaProvider, MediaVariant } from '@prisma/client';

@Injectable()
export class CreateMessageUseCase {
  constructor(private readonly prisma: PrismaService) {}

  private getVariantFromUrl(url: string): MediaVariant {
    const segments = url.split('/');
    const lastSegment = segments.pop() || '';

    if (Object.values(MediaVariant).includes(lastSegment as MediaVariant)) {
      return lastSegment as MediaVariant;
    }

    return MediaVariant.public;
  }

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

      // Crear el mensaje con transacción
      const result = await this.prisma.$transaction(async (tx) => {
        const message = await tx.bookServiceMessage.create({
          data: {
            book_service_id: dto.bookServiceId,
            sender_id: userId,
            message: dto.message,
            media_link_id: null
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

        let mediaLinkId: string | null = null;
        let mediaFiles: any[] = [];

        // Procesar media si existe
        if (dto.media && dto.media.length > 0) {
          const newMediaLink = await tx.mediaLink.create({
            data: {
              owner_type: 'book_service_message',
              owner_id: message.id,
            },
          });

          mediaLinkId = newMediaLink.media_id;
          const mediaFilesToCreate: Array<{
            link_id: string;
            uploaded_by: string;
            kind: MediaKind;
            provider: MediaProvider;
            provider_ref: string;
            type_variant: MediaVariant;
            url: string;
            position: number;
          }> = [];

          for (const [index, mediaItem] of dto.media.entries()) {
            const position = index;

            if (mediaItem.kind === 'image' && mediaItem.variants) {
              for (const variant of mediaItem.variants) {
                mediaFilesToCreate.push({
                  link_id: newMediaLink.media_id,
                  uploaded_by: userId,
                  kind: MediaKind.image,
                  provider: MediaProvider.cloudflare_images,
                  provider_ref: mediaItem.id,
                  type_variant: this.getVariantFromUrl(variant),
                  url: variant,
                  position: position
                });
              }
            }
          }

          if (mediaFilesToCreate.length > 0) {
            await tx.mediaFile.createMany({
              data: mediaFilesToCreate,
            });

            await tx.bookServiceMessage.update({
              where: { id: message.id },
              data: { media_link_id: mediaLinkId },
            });

            mediaFiles = await tx.mediaFile.findMany({
              where: { link_id: mediaLinkId },
              orderBy: { position: 'asc' }
            });
          }
        }

        return { message, mediaFiles };
      });

      return {
        id: result.message.id,
        bookServiceId: result.message.book_service_id,
        senderId: result.message.sender_id,
        message: result.message.message,
        createdAt: result.message.created_at,
        readAt: result.message.read_at,
        sender: {
          id: result.message.sender.id,
          name: result.message.sender.profile?.name || result.message.sender.displayName,
          avatar: result.message.sender.profile?.media_link?.files[0]?.url || null,
        },
        media: result.mediaFiles.map(file => ({
          id: file.id,
          url: file.url,
          variant: file.type_variant,
          position: file.position
        }))
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
import { Injectable, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateRatingDto } from '../../infrastructure/dtos/rating.dto';
import { BookServiceStatus } from '@/modules/bookService/infrastructure/dtos/bookService.dto';

@Injectable()
export class CreateRatingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(raterUserId: string, dto: CreateRatingDto) {
    try {
      if (raterUserId === dto.ratedUserId) {
        throw new BadRequestException('You cannot rate yourself');
      }

      const ratedUser = await this.prisma.user.findUnique({
        where: { id: dto.ratedUserId }
      });

      if (!ratedUser) {
        throw new BadRequestException('Rated user not found');
      }

      if (dto.serviceId) {
        const booking = await this.prisma.bookService.findUnique({
          where: { id: dto.bookingId },
          include: {
            service: {
              include: {
                user: true
              }
            }
          }
        });

        if (!booking) {
          throw new BadRequestException('Booking not found');
        }

        const isClientRater = booking.user_id === raterUserId;
        const isProviderRater = booking.service.user.id === raterUserId;

        if (!isClientRater && !isProviderRater) {
          throw new BadRequestException(
            'You can only rate bookings you are part of'
          );
        }

        if (booking.status !== 'completed' && booking.status !== 'rated') {
          throw new BadRequestException('You can only rate completed bookings');
        }
      }

      const rating = await this.prisma.$transaction(async (tx) => {
        const createdRating = await tx.rating.create({
          data: {
            rated_user_id: dto.ratedUserId,
            rater_user_id: raterUserId,
            service_id: dto.serviceId,
            booking_id: dto.bookingId || null,
            role_of_rater: dto.roleOfRater,
            score: dto.score,
            title: dto.title,
            body: dto.body,
            visibility: dto.visibility || 'public'
          }
        });

        // Solo actualizar los acumuladores del Service si es el cliente quien califica y hay booking
        if (dto.bookingId && dto.roleOfRater === 'client') {
          const booking = await tx.bookService.findUnique({
            where: { id: dto.bookingId },
            select: { service_id: true }
          });

          if (booking?.service_id) {
            await tx.service.update({
              where: { id: booking.service_id },
              data: {
                total_rating_sum: { increment: dto.score },
                rating_count: { increment: 1 }
              }
            });
          }

          // Marcar el booking como rated solo si es el cliente
          await tx.bookService.update({
            where: { id: dto.bookingId },
            data: { status: BookServiceStatus.rated }
          });
        }

        return createdRating;
      });

      return {
        id: rating.id,
        ratedUserId: rating.rated_user_id,
        raterUserId: rating.rater_user_id,
        serviceId: rating.service_id,
        score: rating.score,
        title: rating.title,
        body: rating.body,
        visibility: rating.visibility,
        createdAt: rating.created_at
      };

    } catch (error) {
      if (
        error instanceof BadRequestException || 
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      
      console.error('Error creating rating:', error);
      throw new BadRequestException('Failed to create rating');
    }
  }
}
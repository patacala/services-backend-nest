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
        const service = await this.prisma.service.findUnique({
          where: { id: dto.serviceId },
          include: {
            bookings: {
              where: {
                id: dto.bookingId,
                user_id: raterUserId,
                status: 'completed'
              }
            }
          }
        });

        if (!service) {
          throw new BadRequestException('Service not found');
        }

        if (service.bookings.length === 0) {
          throw new ForbiddenException(
            'You can only rate services you have completed bookings with'
          );
        }
      }

      const rating = await this.prisma.$transaction(async (tx) => {
        
        const createdRating = await tx.rating.create({
          data: {
            rated_user_id: dto.ratedUserId,
            rater_user_id: raterUserId,
            service_id: dto.serviceId || null,
            score: dto.score,
            title: dto.title,
            body: dto.body,
            visibility: dto.visibility || 'public'
          },
          include: {
            ratedUser: {
              select: {
                id: true,
                displayName: true,
                profile: {
                  select: {
                    name: true
                  }
                }
              }
            },
            raterUser: {
              select: {
                id: true,
                displayName: true,
                profile: {
                  select: {
                    name: true
                  }
                }
              }
            },
            service: {
              select: {
                id: true,
                title: true
              }
            }
          }
        });

        await tx.bookService.update({
          where: { id: dto.bookingId },
          data: { status: BookServiceStatus.rated }
        });

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
        createdAt: rating.created_at,
        ratedUser: {
          id: rating.ratedUser.id,
          name: rating.ratedUser.profile?.name || rating.ratedUser.displayName
        },
        raterUser: {
          id: rating.raterUser.id,
          name: rating.raterUser.profile?.name || rating.raterUser.displayName
        },
        service: rating.service ? {
          id: rating.service.id,
          title: rating.service.title
        } : null
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

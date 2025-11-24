import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateRatingDto } from '../../infrastructure/dtos/rating.dto';

@Injectable()
export class UpdateRatingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, ratingId: string, dto: UpdateRatingDto) {
    try {
      const rating = await this.prisma.rating.findUnique({
        where: { id: ratingId }
      });

      if (!rating) {
        throw new NotFoundException('Rating not found');
      }

      if (rating.rater_user_id !== userId) {
        throw new ForbiddenException('You can only update your own ratings');
      }

      const updatedRating = await this.prisma.rating.update({
        where: { id: ratingId },
        data: {
          score: dto.score,
          title: dto.title,
          body: dto.body,
          visibility: dto.visibility
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
          service: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      return {
        id: updatedRating.id,
        ratedUserId: updatedRating.rated_user_id,
        raterUserId: updatedRating.rater_user_id,
        serviceId: updatedRating.service_id,
        score: updatedRating.score,
        title: updatedRating.title,
        body: updatedRating.body,
        visibility: updatedRating.visibility,
        createdAt: updatedRating.created_at,
        ratedUser: {
          id: updatedRating.ratedUser.id,
          name: updatedRating.ratedUser.profile?.name || updatedRating.ratedUser.displayName
        },
        service: updatedRating.service ? {
          id: updatedRating.service.id,
          title: updatedRating.service.title
        } : null
      };
    } catch (error) {
      if (
        error instanceof BadRequestException || 
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      
      console.error('Error updating rating:', error);
      throw new BadRequestException('Failed to update rating');
    }
  }
}
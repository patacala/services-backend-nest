import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetRatingsByServiceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string) {
    console.log(serviceId);
    try {
      const ratings = await this.prisma.rating.findMany({
        where: {
          service_id: serviceId,
          role_of_rater: 'client',
          visibility: 'public',
        },
        include: {
          raterUser: {
            select: {
              id: true,
              displayName: true,
              profile: {
                select: {
                  name: true,
                },
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return {
        ratings: ratings.map(rating => ({
          id: rating.id,
          rating: rating.score.toFixed(1),
          reviewDate: rating.created_at.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
          }),
          username: rating.raterUser.profile?.name || rating.raterUser.displayName,
          reviewText: rating.body,
          reviewImages: [],
          reviewTitle: rating.title || '',
        }))
      };


    } catch (error) {
      console.error('Error getting ratings:', error);
      throw new BadRequestException('Failed to get ratings');
    }
  }
}

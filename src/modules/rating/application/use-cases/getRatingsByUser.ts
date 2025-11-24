import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class GetRatingsByUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, serviceId?: string) {
    try {
      const ratings = await this.prisma.rating.findMany({
        where: {
          rated_user_id: userId,
          service_id: serviceId || undefined,
          visibility: 'public'
        },
        include: {
          raterUser: {
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
          },
          service: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      // Calcular promedio de ratings
      const totalRatings = ratings.length;
      const averageScore = totalRatings > 0 
        ? ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings 
        : 0;

      return {
        userId,
        totalRatings,
        averageScore: Math.round(averageScore * 10) / 10,
        ratings: ratings.map(rating => ({
          id: rating.id,
          score: rating.score,
          title: rating.title,
          body: rating.body,
          createdAt: rating.created_at,
          raterUser: {
            id: rating.raterUser.id,
            name: rating.raterUser.profile?.name || rating.raterUser.displayName,
            avatar: rating.raterUser.profile?.media_link?.files[0]?.url || null
          },
          service: rating.service ? {
            id: rating.service.id,
            title: rating.service.title
          } : null
        }))
      };
    } catch (error) {
      console.error('Error getting ratings:', error);
      throw new BadRequestException('Failed to get ratings');
    }
  }
}
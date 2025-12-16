import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class DeleteRatingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, ratingId: string) {
    try {
      const rating = await this.prisma.rating.findUnique({
        where: { id: ratingId }
      });

      if (!rating) {
        throw new NotFoundException('Rating not found');
      }

      if (rating.rater_user_id !== userId) {
        throw new ForbiddenException('You can only delete your own ratings');
      }

      await this.prisma.rating.delete({
        where: { id: ratingId }
      });

      return { success: true, message: 'Rating deleted successfully' };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new NotFoundException('Failed to delete rating');
    }
  }
}
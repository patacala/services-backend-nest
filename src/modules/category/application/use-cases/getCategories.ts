import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';

export interface GetCategoriesQuery {
  page?: number;
  limit?: number;
  parent_id?: string;
  search?: string;
  language?: 'es' | 'en';
}

@Injectable()
export class GetCategoriesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCategoriesQuery = {}) {
    const {
      page = 1,
      limit = 50,
      parent_id,
      search,
      language
    } = query;

    const selectedLanguage = language || 'es';

    const skip = (page - 1) * limit;
    const whereConditions: any = {};

    if (parent_id !== undefined) {
      whereConditions.parent_id = parent_id ? BigInt(parent_id) : null;
    }

    if (search) {
      const searchField = selectedLanguage === 'es' ? 'name_es' : 'name_en';
      whereConditions[searchField] = {
        contains: search,
        mode: 'insensitive'
      };
    }

    try {
      const categories = await this.prisma.category.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: [
          { parent_id: 'asc' },
          selectedLanguage === 'es' ? { name_es: 'asc' } : { name_en: 'asc' }
        ]
      });

      return {
        categories: categories.map(category => ({
          id: category.id.toString(),
          name: selectedLanguage === 'es' ? category.name_es : category.name_en,
          slug: selectedLanguage === 'es' ? category.slug_es : category.slug_en,
          parent_id: category.parent_id?.toString() || null,
        }))
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw new Error('No se pudieron obtener las categorías');
    }
  }
}

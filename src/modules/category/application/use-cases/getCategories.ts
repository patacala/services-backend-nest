// src/category/application/use-cases/get-categories.ts
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
      language = 'es'
    } = query;

    const skip = (page - 1) * limit;
    const whereConditions: any = {};

    // Filtro por padre (si se especifica)
    if (parent_id !== undefined) {
      whereConditions.parent_id = parent_id ? BigInt(parent_id) : null;
    }

    // Filtro de búsqueda por nombre según idioma
    if (search) {
      const searchField = language === 'es' ? 'name_es' : 'name_en';
      whereConditions[searchField] = {
        contains: search,
        mode: 'insensitive'
      };
    }

    try {
      // Consulta principal con paginación
      const [categories, total] = await Promise.all([
        this.prisma.category.findMany({
          where: whereConditions,
          skip,
          take: limit,
          include: {
            parent: true,
            children: {
              take: 5, // Limitar subcategorías para performance
            },
            _count: {
              select: {
                children: true,
                users: true,
                services: true,
              }
            }
          },
          orderBy: [
            { parent_id: 'asc' },
            language === 'es' ? { name_es: 'asc' } : { name_en: 'asc' }
          ]
        }),
        // Contar total para paginación
        this.prisma.category.count({
          where: whereConditions
        })
      ]);

      // Transformar BigInt a string para serialización JSON
      const transformedCategories = categories.map(category => ({
        id: category.id.toString(),
        name_es: category.name_es,
        name_en: category.name_en,
        slug_es: category.slug_es,
        slug_en: category.slug_en,
        parent_id: category.parent_id?.toString() || null,
        parent: category.parent ? {
          id: category.parent.id.toString(),
          name_es: category.parent.name_es,
          name_en: category.parent.name_en,
          slug_es: category.parent.slug_es,
          slug_en: category.parent.slug_en,
        } : null,
        children: category.children.map(child => ({
          id: child.id.toString(),
          name_es: child.name_es,
          name_en: child.name_en,
          slug_es: child.slug_es,
          slug_en: child.slug_en,
        })),
        counts: {
          children: category._count.children,
          users: category._count.users,
          services: category._count.services,
        }
      }));

      return {
        categories: transformedCategories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        }
      };
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw new Error('No se pudieron obtener las categorías');
    }
  }

  // Método para obtener solo categorías padre
  async getParentCategories(language: 'es' | 'en' = 'es') {
    try {
      const categories = await this.prisma.category.findMany({
        where: { parent_id: null },
        include: {
          _count: {
            select: {
              children: true,
              users: true,
            }
          }
        },
        orderBy: language === 'es' ? { name_es: 'asc' } : { name_en: 'asc' }
      });

      return categories.map(category => ({
        id: category.id.toString(),
        name_es: category.name_es,
        name_en: category.name_en,
        slug_es: category.slug_es,
        slug_en: category.slug_en,
        counts: {
          children: category._count.children,
          users: category._count.users,
        }
      }));
    } catch (error) {
      console.error('Error al obtener categorías padre:', error);
      throw new Error('No se pudieron obtener las categorías padre');
    }
  }

  // Método para obtener una categoría específica
  async getCategoryById(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: BigInt(id) },
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              children: true,
              users: true,
              services: true,
            }
          }
        }
      });

      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      return {
        id: category.id.toString(),
        name_es: category.name_es,
        name_en: category.name_en,
        slug_es: category.slug_es,
        slug_en: category.slug_en,
        parent_id: category.parent_id?.toString() || null,
        parent: category.parent ? {
          id: category.parent.id.toString(),
          name_es: category.parent.name_es,
          name_en: category.parent.name_en,
        } : null,
        children: category.children.map(child => ({
          id: child.id.toString(),
          name_es: child.name_es,
          name_en: child.name_en,
        })),
        counts: {
          children: category._count.children,
          users: category._count.users,
          services: category._count.services,
        }
      };
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      throw new Error('No se pudo obtener la categoría');
    }
  }

  // Método para obtener categorías de un usuario específico
  async getUserCategories(userId: string) {
    try {
      const userCategories = await this.prisma.userCategory.findMany({
        where: { userId },
        include: {
          category: true
        }
      });

      return userCategories.map(uc => ({
        userId: uc.userId,
        categoryId: uc.categoryId.toString(),
        category: {
          id: uc.category.id.toString(),
          name_es: uc.category.name_es,
          name_en: uc.category.name_en,
          slug_es: uc.category.slug_es,
          slug_en: uc.category.slug_en,
        }
      }));
    } catch (error) {
      console.error('Error al obtener categorías del usuario:', error);
      throw new Error('No se pudieron obtener las categorías del usuario');
    }
  }
}
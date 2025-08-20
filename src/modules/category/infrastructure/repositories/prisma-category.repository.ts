import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository, CategoryWithRelations, GetCategoriesQuery, PaginatedCategories, UserCategoryRelation } from '../../domain/repositories/user.repository';


@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: GetCategoriesQuery = {}): Promise<PaginatedCategories> {
    const {
      page = 1,
      limit = 50,
      parent_id,
      search,
      language = 'es'
    } = query;

    const skip = (page - 1) * limit;
    const whereConditions: any = {};

    if (parent_id !== undefined) {
      whereConditions.parent_id = parent_id ? BigInt(parent_id) : null;
    }

    if (search) {
      const searchField = language === 'es' ? 'name_es' : 'name_en';
      whereConditions[searchField] = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: {
          parent: true,
          children: {
            take: 5,
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
      this.prisma.category.count({
        where: whereConditions
      })
    ]);

    const transformedCategories = categories.map(category => this.mapToEntityWithRelations(category));

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
  }

  async findParentCategories(language: 'es' | 'en' = 'es'): Promise<CategoryWithRelations[]> {
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

    return categories.map(category => this.mapToEntityWithRelations(category));
  }

  async findById(id: string): Promise<CategoryWithRelations | null> {
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

    if (!category) return null;
    return this.mapToEntityWithRelations(category);
  }

  async findUserCategories(userId: string): Promise<UserCategoryRelation[]> {
    const userCategories = await this.prisma.userCategory.findMany({
      where: { userId },
      include: {
        category: true
      }
    });

    return userCategories.map(uc => ({
      userId: uc.userId,
      categoryId: uc.categoryId.toString(),
      category: new Category(
        uc.category.id.toString(),
        uc.category.name_es,
        uc.category.name_en,
        uc.category.slug_es,
        uc.category.slug_en,
        uc.category.parent_id?.toString()
      )
    }));
  }

  async create(data: Partial<Category>): Promise<Category> {
    const c = await this.prisma.category.create({
      data: {
        name_es: data.name_es!,
        name_en: data.name_en!,
        slug_es: data.slug_es!,
        slug_en: data.slug_en!,
        parent_id: data.parent_id ? BigInt(data.parent_id) : null,
      },
    });
    
    return new Category(
      c.id.toString(),
      c.name_es,
      c.name_en,
      c.slug_es,
      c.slug_en,
      c.parent_id?.toString(),
    );
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const updateData: any = {};
    if (data.name_es) updateData.name_es = data.name_es;
    if (data.name_en) updateData.name_en = data.name_en;
    if (data.slug_es) updateData.slug_es = data.slug_es;
    if (data.slug_en) updateData.slug_en = data.slug_en;
    if (data.parent_id !== undefined) {
      updateData.parent_id = data.parent_id ? BigInt(data.parent_id) : null;
    }

    const c = await this.prisma.category.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return new Category(
      c.id.toString(),
      c.name_es,
      c.name_en,
      c.slug_es,
      c.slug_en,
      c.parent_id?.toString(),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id: BigInt(id) }
    });
  }

  private mapToEntityWithRelations(category: any): CategoryWithRelations {
    return {
      ...new Category(
        category.id.toString(),
        category.name_es,
        category.name_en,
        category.slug_es,
        category.slug_en,
        category.parent_id?.toString(),
        category.createdAt,
        category.updatedAt
      ),
      parent: category.parent ? new Category(
        category.parent.id.toString(),
        category.parent.name_es,
        category.parent.name_en,
        category.parent.slug_es,
        category.parent.slug_en,
        category.parent.parent_id?.toString()
      ) : null,
      children: category.children?.map((child: any) => new Category(
        child.id.toString(),
        child.name_es,
        child.name_en,
        child.slug_es,
        child.slug_en,
        child.parent_id?.toString()
      )) || [],
      counts: category._count ? {
        children: category._count.children,
        users: category._count.users,
        services: category._count.services || 0,
      } : undefined
    };
  }
}
import { Category } from '../entities/category.entity';

export interface GetCategoriesQuery {
  page?: number;
  limit?: number;
  parent_id?: string;
  search?: string;
  language?: 'es' | 'en';
}

export interface CategoryWithRelations extends Category {
  parent?: Category | null;
  children?: Category[];
  counts?: {
    children: number;
    users: number;
    services: number;
  };
}

export interface PaginatedCategories {
  categories: CategoryWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserCategoryRelation {
  userId: string;
  categoryId: string;
  category: Category;
}

export abstract class CategoryRepository {
  abstract findMany(query: GetCategoriesQuery): Promise<PaginatedCategories>;
  abstract findParentCategories(language?: 'es' | 'en'): Promise<CategoryWithRelations[]>;
  abstract findById(id: string): Promise<CategoryWithRelations | null>;
  abstract findUserCategories(userId: string): Promise<UserCategoryRelation[]>;
  abstract create(data: Partial<Category>): Promise<Category>;
  abstract update(id: string, data: Partial<Category>): Promise<Category>;
  abstract delete(id: string): Promise<void>;
}
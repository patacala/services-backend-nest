import { Controller, Get, Query, Param } from '@nestjs/common';
import { GetCategoriesUseCase } from '../../application/use-cases/getCategories';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly getCategoriesUC: GetCategoriesUseCase
  ) {}

  @Get()
  async getCategories(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('parent_id') parent_id?: string,
    @Query('search') search?: string,
    @Query('language') language?: 'es' | 'en'
  ) {
    const query = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      parent_id,
      search,
      language
    };
    
    return this.getCategoriesUC.execute(query);
  }

  @Get('parents')
  async getParentCategories(@Query('language') language?: 'es' | 'en') {
    return this.getCategoriesUC.getParentCategories(language);
  }

  @Get('user/:userId')
  async getUserCategories(@Param('userId') userId: string) {
    return this.getCategoriesUC.getUserCategories(userId);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.getCategoriesUC.getCategoryById(id);
  }
}
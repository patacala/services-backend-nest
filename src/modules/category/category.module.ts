import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryController } from './infrastructure/controllers/category.controller';
import { PrismaCategoryRepository } from './infrastructure/repositories/prisma-category.repository';
import { SharedModule } from '@/shared/shared.module';
import { CategoryRepository } from './domain/repositories/user.repository';
import { GetCategoriesUseCase } from './application/use-cases/getCategories';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
  ],
  controllers: [CategoryController],
  providers: [
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    GetCategoriesUseCase,
  ],
  exports: [CategoryRepository],
})
export class CategoryModule {}
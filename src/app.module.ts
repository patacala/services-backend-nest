import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ServiceModule } from './modules/service/service.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { BookServiceController } from './modules/bookService/infrastructure/controllers/bookService.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CategoryModule,
    ServiceModule,
    FavoriteModule,
    BookServiceController
  ],
})
export class AppModule {}

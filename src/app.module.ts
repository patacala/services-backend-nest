import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ServiceModule } from './modules/service/service.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { BookServiceModule } from './modules/bookService/bookService.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CategoryModule,
    ServiceModule,
    FavoriteModule,
    BookServiceModule
  ],
})
export class AppModule {}

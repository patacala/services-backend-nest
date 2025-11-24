import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ServiceModule } from './modules/service/service.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { BookServiceModule } from './modules/bookService/bookService.module';
import { MediaModule } from './modules/media/media.module';
import { MessagesModule } from './modules/message/message.module';
import { RatingsModule } from './modules/rating/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CategoryModule,
    ServiceModule,
    FavoriteModule,
    BookServiceModule,
    MediaModule,
    MessagesModule,
    RatingsModule
  ],
})
export class AppModule {}

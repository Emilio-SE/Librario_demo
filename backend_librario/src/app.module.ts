import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
import { BookModule } from './library/book/book.module';
import { AuthModule } from './auth/auth.module';
import { BookshelfModule } from './library/bookshelf/bookshelf.module';
import { ShelfModule } from './library/shelf/shelf.module';
import { BooksetModule } from './library/bookset/bookset.module';
import { CategoryModule } from './library/category/category.module';
import { TagModule } from './library/tag/tag.module';
import { ReadingsModule } from './reading/readings/readings.module';
import { GoalsModule } from './reading/goals/goals.module';
import { BooksModule } from './statistics/books/books.module';
import { MoneyModule } from './statistics/money/money.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './account/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'passworD',
      database: process.env.DB_NAME || 'librario',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    BookModule,
    AuthModule,
    BookshelfModule,
    ShelfModule,
    BooksetModule,
    CategoryModule,
    TagModule,
    ReadingsModule,
    GoalsModule,
    BooksModule,
    MoneyModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

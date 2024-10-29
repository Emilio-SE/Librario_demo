import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Book } from './book.entity';

import { BookService } from './book.service';

import { BookController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookService, JwtStrategy],
  controllers: [BookController]
})
export class BookModule {}

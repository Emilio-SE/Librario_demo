import { Module } from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { BookshelfController } from './bookshelf.controller';

@Module({
  providers: [BookshelfService],
  controllers: [BookshelfController]
})
export class BookshelfModule {}

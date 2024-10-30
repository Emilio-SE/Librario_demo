import { Module } from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { BookshelfController } from './bookshelf.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  providers: [BookshelfService, JwtStrategy],
  controllers: [BookshelfController]
})
export class BookshelfModule {}

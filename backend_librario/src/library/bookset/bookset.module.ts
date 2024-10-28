import { Module } from '@nestjs/common';
import { BooksetService } from './bookset.service';
import { BooksetController } from './bookset.controller';

@Module({
  providers: [BooksetService],
  controllers: [BooksetController]
})
export class BooksetModule {}

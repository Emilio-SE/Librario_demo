import { Module } from '@nestjs/common';
import { BooksetService } from './bookset.service';
import { BooksetController } from './bookset.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookset } from './bookset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookset])],
  providers: [BooksetService, JwtStrategy],
  controllers: [BooksetController]
})
export class BooksetModule {}

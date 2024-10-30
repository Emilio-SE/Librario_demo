import { Module } from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { ShelfController } from './shelf.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  providers: [ShelfService, JwtStrategy],
  controllers: [ShelfController]
})
export class ShelfModule {}

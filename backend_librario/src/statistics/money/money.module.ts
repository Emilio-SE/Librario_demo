import { Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  providers: [MoneyService, JwtStrategy],
  controllers: [MoneyController]
})
export class MoneyModule {}

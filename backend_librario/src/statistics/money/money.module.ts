import { Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';

@Module({
  providers: [MoneyService],
  controllers: [MoneyController]
})
export class MoneyModule {}

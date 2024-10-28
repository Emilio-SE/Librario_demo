import { Module } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { ReadingsController } from './readings.controller';

@Module({
  providers: [ReadingsService],
  controllers: [ReadingsController]
})
export class ReadingsModule {}

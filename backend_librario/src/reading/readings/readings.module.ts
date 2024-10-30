import { Module } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { ReadingsController } from './readings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [ReadingsService, JwtStrategy],
  controllers: [ReadingsController]
})
export class ReadingsModule {}

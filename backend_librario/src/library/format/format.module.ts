import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Format } from './format.entity';

import { FormatController } from './format.controller';

import { FormatService } from './format.service';

@Module({
  imports: [TypeOrmModule.forFeature([Format])],
  providers: [FormatService, JwtStrategy],
  controllers: [FormatController],
})
export class FormatModule {}

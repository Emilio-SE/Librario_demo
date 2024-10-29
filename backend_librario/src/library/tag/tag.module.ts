import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from './tag.entity';

import { TagController } from './tag.controller';

import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService, JwtStrategy],
  controllers: [TagController]
})
export class TagModule {}

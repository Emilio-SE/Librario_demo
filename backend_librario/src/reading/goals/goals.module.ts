import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [GoalsService, JwtStrategy],
  controllers: [GoalsController]
})
export class GoalsModule {}

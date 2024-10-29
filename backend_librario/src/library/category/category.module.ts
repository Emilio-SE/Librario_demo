import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './category.entity';
import { User } from 'src/account/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Genre, User])],
  providers: [CategoryService, JwtStrategy],
  controllers: [CategoryController]
})
export class CategoryModule {}

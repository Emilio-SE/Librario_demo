import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Request } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GenreDto } from './dto/genre-previews.dto';
import { CategoryResultDto } from './dto/category-result.dto';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Controller('library/category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private categorySvc: CategoryService) {}

  @Post()
  createCategory(
    @Req() req: Request,
    @Body() body: CreateCategoryDto,
  ): Promise<CategoryResultDto> {
    return this.categorySvc.createCategory(req.user['id'], body);
  }

  @Get()
  async getPreviewCategories(@Req() req: Request): Promise<GenreDto[]> {
    return this.categorySvc.getPreviewCategories(req.user['id']);
  }

  @Delete(':category_id')
  async deleteGenre(@Req() req: Request): Promise<MessageResponse> {
    const id = Number(req.params['category_id']);
    return this.categorySvc.deleteGenre(id, req.user['id']);
  }
}

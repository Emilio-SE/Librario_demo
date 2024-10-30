import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';

import { BookshelfService } from './bookshelf.service';

@Controller('library/bookshelf')
@UseGuards(JwtAuthGuard)
export class BookshelfController {
  constructor(private readonly bookshelfSvc: BookshelfService) {}

  @Post()
  createBookshelf(
    @Req() req: Request,
    @Body() createBookshelfDto: CreateBookshelfDto,
  ) {
    const userId = req.user['id'];
    return this.bookshelfSvc.createBookshelf(createBookshelfDto, userId);
  }

  @Get()
  getBookshelvesPreview(@Req() req: Request) {
    const userId = req.user['id'];
    return this.bookshelfSvc.getBookshelves(userId);
  }

  @Get(':bookshelf_id')
  getBookshelfDetails(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelf_id: string,
  ) {
    const userId = req.user['id'];
    return this.bookshelfSvc.getBookshelfDetails(userId, +bookshelf_id);
  }

  @Patch(':bookshelf_id')
  updateBookshelf(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelf_id: string,
    @Body() updateBookshelfDto: UpdateBookshelfDto,
  ) {
    const userId = req.user['id'];
    return this.bookshelfSvc.updateBookshelf(
      userId,
      +bookshelf_id,
      updateBookshelfDto,
    );
  }

  @Delete(':bookshelf_id')
  deleteBookshelf(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelf_id: string,
  ) {
    const userId = req.user['id'];
    return this.bookshelfSvc.deleteBookshelf(userId, +bookshelf_id);
  }
}

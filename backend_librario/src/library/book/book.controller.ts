import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { Book } from './book.entity';

import { CreateBookDto } from './dto/create-book.dto';
import { BookPreviewDto } from './dto/book-preview.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { BookService } from './book.service';

@Controller('library/book')
@UseGuards(JwtAuthGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto, @Req() req: Request) {
    const userId = req.user['id'];
    return await this.bookService.createBook(createBookDto, userId);
  }

  @Get()
  async getBookPreview(@Req() req: Request): Promise<BookPreviewDto[]> {
    return this.bookService.getBookPreview(req.user['id']);
  }

  @Get(':book_id')
  async getBookDetails(@Req() req: Request): Promise<BookPreviewDto> {
    const bookId = parseInt(req.params['book_id']);
    return this.bookService.getBookDetails(bookId, req.user['id']);
  }

  @Patch(':book_id')
  async updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Req() req: Request,
  ): Promise<Book> {
    const bookId = parseInt(req.params['book_id']);
    return this.bookService.updateBook(bookId, req.user['id'], updateBookDto);
  }

  @Delete(':book_id')
  async deleteBook(@Req() req: Request): Promise<HttpStatus> {
    const bookId = parseInt(req.params['book_id']);
    return this.bookService.deleteBook(bookId, req.user['id']);
  }
}

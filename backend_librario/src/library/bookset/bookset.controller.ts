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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';

import { Bookset } from './bookset.entity';

import { CreateBooksetDto } from './dto/create-bookset.dto';
import { UpdateBooksetDto } from './dto/update-bookset.dto';

import { BooksetService } from './bookset.service';

@Controller('library/bookset')
@UseGuards(JwtAuthGuard)
export class BooksetController {
  constructor(private readonly booksetService: BooksetService) {}

  @Post()
  async createBookset(
    @Body() body: CreateBooksetDto,
    @Req() req: Request,
  ): Promise<Bookset> {
    const userId = req.user['id'];
    return await this.booksetService.createBookset(
      userId,
      body.name,
      body.book,
    );
  }

  @Get()
  getBooksetPreview(@Req() req: Request): Promise<any[]> {
    const userId = req.user['id'];
    return this.booksetService.getUserBooksets(userId);
  }

  @Get(':bookset_id')
  getBooksetDetails(
    @Req() req: Request,
    @Param('bookset_id') booksetId: string,
  ): Promise<any> {
    const userId = req.user['id'];
    return this.booksetService.getBooksetDetails(userId, +booksetId);
  }

  @Patch(':bookset_id')
  async updateBookset(
    @Body() updateData: UpdateBooksetDto,
    @Req() req: Request,
    @Param('bookset_id') booksetId: string,
  ) {
    const userId = req.user['id'];
    return this.booksetService.updateBookset(userId, +booksetId, updateData);
  }

  @Delete(':id')
  async deleteBookset(@Req() req: Request, @Param('id') booksetId: string) {
    const userId = req.user['id'];
    return this.booksetService.deleteBookset(userId, +booksetId);
  }
}

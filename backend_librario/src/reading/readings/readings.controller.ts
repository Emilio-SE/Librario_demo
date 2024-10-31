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
import { ReadingsService } from './readings.service';
import { UpdateReadingDto } from './dto/update-read.dto';

@Controller('reading/readings')
@UseGuards(JwtAuthGuard)
export class ReadingsController {
  constructor(private readingSvc: ReadingsService) {}

  @Post()
  async createReading(@Req() req: Request, @Body() body: any) {
    const userId = req.user['id'];
    return this.readingSvc.createReading(userId, body);
  }

  @Get('book/:book_id')
  async getBooksPreview(@Req() req: Request, @Param('book_id') bookId: string) {
    const userId = req.user['id'];
    return this.readingSvc.getBookSummary(+bookId, userId);
  }

  @Get()
  async getReadingsPreview(@Req() req: Request) {
    const userId = req.user['id'];
    return this.readingSvc.getAllReadings(userId);
  }

  @Get(':reading_id')
  async getReading(
    @Req() req: Request,
    @Param('reading_id') readingId: string,
  ) {
    const userId = req.user['id'];
    return this.readingSvc.getReadingDetails(userId, +readingId);
  }

  @Patch(':reading_id')
  async updateReading(
    @Req() req: Request,
    @Param('reading_id') readingId: string,
    @Body() body: UpdateReadingDto,
  ) {
    const userId = req.user['id'];
    return this.readingSvc.updateReading(userId, +readingId, body);
  }

  @Delete(':reading_id')
  async deleteReading(
    @Req() req: Request,
    @Param('reading_id') readingId: string,
  ) {
    const userId = req.user['id'];
    return this.readingSvc.deleteReading(userId, +readingId);
  }
}

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

@Controller('reading/readings')
@UseGuards(JwtAuthGuard)
export class ReadingsController {

  constructor(private readingSvc: ReadingsService) {}

  @Post()
  async createReading(@Req() req: Request, @Body() body: any) {
    const userId = req.user['id'];
    return 'Create Reading';
  }

  @Get('preview')
  async getBooksPreview(@Req() req: Request) {
    const userId = req.user['id'];
    return 'Books Preview';
  }

  @Get()
  async getReadings(@Req() req: Request) {
    const userId = req.user['id'];
    return 'Readings';
  }

  @Get(':reading_id')
  async getReading(
    @Req() req: Request,
    @Param('reading_id') readingId: string,
  ) {
    const userId = req.user['id'];
    return 'Reading';
  }

  @Patch(':reading_id')
  async updateReading(
    @Req() req: Request,
    @Param('reading_id') readingId: string,
    @Body() body: any,
  ) {
    const userId = req.user['id'];
    return 'Update Reading';
  }

  @Delete(':reading_id')
  async deleteReading(
    @Req() req: Request,
    @Param('reading_id') readingId: string,
  ) {
    const userId = req.user['id'];
    return 'Delete Reading';
  }
}

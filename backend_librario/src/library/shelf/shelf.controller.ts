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
import { ShelfService } from './shelf.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@Controller('library/bookshelf/:bookshelf_id/shelf')
@UseGuards(JwtAuthGuard)
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  createShelf(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelfId: string,
    @Body() createShelfDto: CreateShelfDto,
  ) {
    const userId = req.user['id'];
    return this.shelfService.createShelf(userId, +bookshelfId, createShelfDto);
  }

  @Get()
  getShelvesPreview(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelfId: string,
  ) {
    const userId = req.user['id'];
    return this.shelfService.getShelvesForBookshelf(userId, +bookshelfId);
  }

  @Get(':shelf_id')
  getShelfDetails(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelfId: string,
    @Param('shelf_id') shelfId: string,
  ) {
    const userId = req.user['id'];
    return this.shelfService.getShelfDetails(userId, +bookshelfId, +shelfId);
  }

  @Patch(':shelf_id')
  updateShelf(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelfId: string,
    @Param('shelf_id') shelfId: string,
    @Body() updateShelfDto: UpdateShelfDto,
  ) {
    const userId = req.user['id'];
    return this.shelfService.updateShelf(
      userId,
      +bookshelfId,
      +shelfId,
      updateShelfDto,
    );
  }

  @Delete(':shelf_id')
  deleteShelf(
    @Req() req: Request,
    @Param('bookshelf_id') bookshelfId: string,
    @Param('shelf_id') shelfId: string,
  ) {
    const userId = req.user['id'];
    return this.shelfService.deleteShelf(userId, +bookshelfId, +shelfId);
  }
}

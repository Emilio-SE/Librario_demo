import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('statistics/books')
@UseGuards(JwtAuthGuard)
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Get('read')
    getReadBooksByMonth(
        @Req() req: Request
    ): Promise<any> {
        const userId = req.user['id'];
        return this.booksService.getReadBooksByMonth(userId);
    }

}

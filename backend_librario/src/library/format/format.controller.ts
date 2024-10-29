import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { FormatService } from './format.service';

import { Format } from './format.entity';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class FormatController {
    
    constructor(private formatSvc: FormatService) {}

    @Get('format')
    async getFormat(): Promise<Format[]> {
        return await this.formatSvc.getFormats();
    }

}
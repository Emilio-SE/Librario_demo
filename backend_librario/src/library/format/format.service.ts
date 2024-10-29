import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Format } from './format.entity';

@Injectable()
export class FormatService {

    constructor(
        @InjectRepository(Format) private formatRepository: Repository<Format>,
    ) {}

    public async getFormats(): Promise<Format[]> {
        return await this.formatRepository.find();
    }

}

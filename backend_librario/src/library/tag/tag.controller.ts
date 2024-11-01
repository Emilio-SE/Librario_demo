import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { CreateTagDto } from './dto/create-tag.dto';
import { TagPreviewsDto } from './dto/tag-previews.dto';

import { Tag } from './tag.entity';

import { TagService } from './tag.service';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Controller('library/tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async createTag(
    @Body() createTagDto: CreateTagDto,
    @Req() req: Request,
  ): Promise<Tag> {
    console.log(req.user);
    return this.tagService.createTag(createTagDto, req.user['id']);
  }

  @Get()
  async getPreviewTags(
    @Req() req: Request,
  ): Promise<TagPreviewsDto[]> {
    return this.tagService.getPreviewTags(req.user['id']);
  }

  @Delete(":tagId")
    async deleteTag(
        @Req() req: Request,
    ): Promise<MessageResponse> {
        const tagId: number = parseInt(req.params.tagId);
        return this.tagService.deleteTag(req.user['id'], tagId);
    }
}

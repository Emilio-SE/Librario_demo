import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagPreviewsDto } from './dto/tag-previews.dto';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(createTagDto: CreateTagDto, userId: number): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...createTagDto,
      user: { id: userId },
    });
    return this.tagRepository.save(tag);
  }

  async getPreviewTags(userId: number): Promise<TagPreviewsDto[]> {
    const tags = await this.tagRepository.find({
      where: { user: { id: userId } },
    });
    return tags.map((tag) => new TagPreviewsDto(tag.id, tag.name));
  }

  async deleteTag(userId: number, tagId: number): Promise<MessageResponse> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId, user: { id: userId } },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.tagRepository.remove(tag);
    return { message: 'Tag deleted successfully' };
  }
}

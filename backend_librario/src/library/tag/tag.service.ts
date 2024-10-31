import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagPreviewsDto } from './dto/tag-previews.dto';
import { MessageResponse } from 'src/common/interfaces/response.interface';
import { ValidateUtils } from 'src/common/utils/validate.utils';

@Injectable()
export class TagService {
  
  private readonly validity = new ValidateUtils();
  
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

  async deleteTag(userId: number, tagId: number): Promise<HttpStatus> {
    
    const tag = await this.validity.findByRepository(
      this.tagRepository,
      { where: { id: tagId, user: { id: userId } } },
      'Tag',
    );

    await this.tagRepository.remove(tag);
    return HttpStatus.OK;
  }
}

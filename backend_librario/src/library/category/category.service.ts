import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/account/user/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GenreDto } from './dto/genre-previews.dto';
import { CategoryResultDto } from './dto/category-result.dto';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCategory(
    userId: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResultDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const newCategory = this.genreRepository.create({
      ...createCategoryDto,
      user,
    });
    const result = await this.genreRepository.save(newCategory);

    return {
      id: result.id,
      name: result.name,
    } as CategoryResultDto;
  }

  async getPreviewCategories(id: number): Promise<GenreDto[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['genres'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
    }));
  }

  async deleteGenre(id: number, userId: number): Promise<MessageResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['genres'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const genre = user.genres.find((genre) => genre.id === id);

    console.log(genre);

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    await this.genreRepository.remove(genre);

    return { message: 'Genre deleted', statusCode: 200 };
  }
}

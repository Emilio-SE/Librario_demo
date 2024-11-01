import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Bookshelf } from './bookshelf.entity';
import { Shelf } from '../shelf/shelf.entity';
import { ShelfBook } from '../shelf-book/shelf-book.entity';

import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { BookshelfDto } from './dto/bookshelf-preview.dto';
import {
  BookshelfDetailsDto,
  ShelfSummaryDto,
} from './dto/bookshelf-details.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';

import { ValidateUtils } from 'src/common/utils/validate.utils';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class BookshelfService {
  private readonly validateUtils: ValidateUtils = new ValidateUtils();

  constructor(private readonly entityManager: EntityManager) {}

  // -- Create a new bookshelf

  async createBookshelf(bookshelfDto: CreateBookshelfDto, userId: number) {
    const newBookshelf = this.entityManager.create(Bookshelf, {
      name: bookshelfDto.name,
      user: { id: userId },
    });

    const bookshelf = await this.entityManager.save(newBookshelf);

    return {
      id: bookshelf.id,
      name: bookshelf.name,
    };
  }

  // -- Get bookshelf preview

  async getBookshefPreview(userId: number): Promise<BookshelfDto[]> {
    const bookshelves = await this.entityManager.find(Bookshelf, {
      where: { user: { id: userId } },
    });

    const bookshelfDtos = await Promise.all(
      bookshelves.map(async (bookshelf) => {
        const shelfCount = await this.entityManager.count(Shelf, {
          where: { bookshelf: { id: bookshelf.id } },
        });

        return {
          id: bookshelf.id.toString(),
          name: bookshelf.name,
          shelfQuantity: shelfCount.toString(),
        };
      }),
    );

    return bookshelfDtos;
  }

  // -- Get bookshelf details

  async getBookshelfDetails(
    userId: number,
    bookshelfId: number,
  ): Promise<BookshelfDetailsDto> {
    const bookshelf = await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: bookshelfId, user: { id: userId } } },
      'Bookshelf',
      Bookshelf,
    );

    const shelves = await this.getShelvesWithBookCount(bookshelfId);

    return {
      id: bookshelf.id.toString(),
      name: bookshelf.name,
      shelves,
    };
  }

  private async getShelvesWithBookCount(
    bookshelfId: number,
  ): Promise<ShelfSummaryDto[]> {
    const shelves = await this.entityManager.find(Shelf, {
      where: { bookshelf: { id: bookshelfId } },
    });

    return await Promise.all(
      shelves.map(async (shelf) => {
        const booksCount = await this.entityManager.count(ShelfBook, {
          where: { shelf: { id: shelf.id } },
        });

        return {
          id: shelf.id.toString(),
          name: shelf.name,
          booksQuantity: booksCount.toString(),
        };
      }),
    );
  }

  // -- Update bookshelf

  async updateBookshelf(
    userId: number,
    bookshelfId: number,
    updateBookshelfDto: UpdateBookshelfDto,
  ) {
    const { name } = updateBookshelfDto;

    const bookshelf = await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: bookshelfId, user: { id: userId } } },
      'Bookshelf',
      Bookshelf,
    );

    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Invalid bookshelf name');
    }

    bookshelf.name = name;
    await this.entityManager.save(bookshelf);

    return bookshelf;
  }

  // -- Delete bookshelf

  async deleteBookshelf(
    userId: number,
    bookshelfId: number,
  ): Promise<MessageResponse> {
    const bookshelf = await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: bookshelfId, user: { id: userId } } },
      'Bookshelf',
      Bookshelf,
    );

    const shelves = await this.getShelvesForBookshelf(bookshelfId);

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await this.deleteShelfBooksAndShelves(
        shelves,
        transactionalEntityManager,
      );
      await transactionalEntityManager.remove(bookshelf);
    });

    return {
      message: 'Bookshelf and all associated shelves deleted successfully',
    };
  }

  private async getShelvesForBookshelf(bookshelfId: number): Promise<Shelf[]> {
    return this.entityManager.find(Shelf, {
      where: { bookshelf: { id: bookshelfId } },
    });
  }

  private async deleteShelfBooksAndShelves(
    shelves: Shelf[],
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const shelfIds = shelves.map((shelf) => shelf.id);
    if (shelfIds.length) {
      await transactionalEntityManager.delete('shelfbook', {
        shelfId: shelfIds,
      });
      await transactionalEntityManager.remove(shelves);
    }
  }
}

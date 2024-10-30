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
import { BookshelfDetailsDto } from './dto/bookshelf-details.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';

@Injectable()
export class BookshelfService {
  constructor(private readonly entityManager: EntityManager) {}

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

  async getBookshelves(userId: number): Promise<BookshelfDto[]> {
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

  async getBookshelfDetails(
    userId: number,
    bookshelfId: number,
  ): Promise<BookshelfDetailsDto> {
    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new NotFoundException(
        `Bookshelf with id ${bookshelfId} not found.`,
      );
    }

    const shelves = await this.entityManager.find(Shelf, {
      where: { bookshelf: { id: bookshelfId } },
    });

    const shelfDetails = await Promise.all(
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

    return {
      id: bookshelf.id.toString(),
      name: bookshelf.name,
      shelves: shelfDetails,
    };
  }

  async updateBookshelf(
    userId: number,
    bookshelfId: number,
    updateBookshelfDto: UpdateBookshelfDto,
  ) {
    const { name } = updateBookshelfDto;

    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new NotFoundException(
        `Bookshelf not found or does not belong to this user`,
      );
    }

    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Invalid bookshelf name');
    }

    bookshelf.name = name;
    await this.entityManager.save(bookshelf);

    return bookshelf;
  }

  async deleteBookshelf(userId: number, bookshelfId: number) {
    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new NotFoundException(
        `Bookshelf with id ${bookshelfId} not found for user ${userId}`,
      );
    }

    // Obtener todos los Shelf asociados al Bookshelf
    const shelves = await this.entityManager.find(Shelf, {
      where: { bookshelf: { id: bookshelfId } },
    });

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // Eliminar todas las referencias de los libros en la tabla intermedia shelf_book
      const shelfIds = shelves.map((shelf) => shelf.id);
      if (shelfIds.length) {
        await transactionalEntityManager.delete('shelfbook', {
          shelfId: shelfIds,
        });
      }

      // Eliminar todos los Shelf asociados al Bookshelf
      if (shelves.length) {
        await transactionalEntityManager.remove(shelves);
      }

      // Eliminar el Bookshelf
      await transactionalEntityManager.remove(bookshelf);
    });

    return {
      message: 'Bookshelf and all associated shelves deleted successfully',
    };
  }
}

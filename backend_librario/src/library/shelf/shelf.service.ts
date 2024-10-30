import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';

import { Shelf } from './shelf.entity';
import { ShelfBook } from '../shelf-book/shelf-book.entity';
import { Bookshelf } from '../bookshelf/bookshelf.entity';
import { Book } from '../book/book.entity';

import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@Injectable()
export class ShelfService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createShelf(
    userId: number,
    bookshelfId: number,
    createShelfDto: CreateShelfDto,
  ) {
    const { name, book } = createShelfDto;

    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new ForbiddenException(
        'El Bookshelf no pertenece al usuario o no existe.',
      );
    }

    const newShelf = this.entityManager.create(Shelf, {
      name,
      user: { id: userId },
      bookshelf: { id: bookshelfId },
    });

    const savedShelf = await this.entityManager.save(newShelf);

    if (book && book.length) {
      const userBooks = await this.entityManager.find(Book, {
        where: { id: In(book.map(Number)), user: { id: userId } },
      });

      if (userBooks.length !== book.length) {
        throw new ForbiddenException(
          'Uno o más libros no pertenecen al usuario.',
        );
      }

      const shelfBooks = userBooks.map((userBook) => ({
        shelfId: savedShelf.id,
        bookId: userBook.id,
      }));
      await this.entityManager.insert(ShelfBook, shelfBooks);
    }

    return savedShelf;
  }

  async getShelvesForBookshelf(userId: number, bookshelfId: number) {

    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new NotFoundException(
        `Bookshelf with id ${bookshelfId} not found for user ${userId}`,
      );
    }

    const shelves = await this.entityManager.find(Shelf, {
      where: { bookshelf: { id: bookshelfId } },
    });

    return await Promise.all(
      shelves.map(async (shelf) => {
        const bookQuantity = await this.entityManager.count(ShelfBook, {
          where: { shelf: { id: shelf.id } },
        });

        return {
          id: shelf.id,
          name: shelf.name,
          bookQuantity,
        };
      }),
    );
  }

  async getShelfDetails(userId: number, bookshelfId: number, shelfId: number) {
    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new NotFoundException(
        `Bookshelf with id ${bookshelfId} not found for user ${userId}`,
      );
    }

    // Obtener el Shelf específico dentro del Bookshelf
    const shelf = await this.entityManager.findOne(Shelf, {
      where: { id: shelfId, bookshelf: { id: bookshelfId } },
    });

    if (!shelf) {
      throw new NotFoundException(
        `Shelf with id ${shelfId} not found in bookshelf ${bookshelfId}`,
      );
    }

    console.log(shelf);

    const books = await this.entityManager
      .createQueryBuilder(Book, 'book')
      .leftJoin('shelfbook', 'sb', 'sb.bookId = book.id')
      .where('sb.shelfId = :shelfId', { shelfId: shelf.id })
      .select(['book.id', 'book.title', 'book.author'])
      .getRawMany();

    return {
      id: shelf.id,
      name: shelf.name,
      books: books.map((book) => ({
        id: book.book_id,
        name: book.book_title,
        author: book.book_author,
      })),
    };
  }

  async updateShelf(
    userId: number,
    bookshelfId: number,
    shelfId: number,
    updateShelfDto: UpdateShelfDto,
  ) {
    const { name, books } = updateShelfDto;

    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new NotFoundException(
        `Bookshelf with id ${bookshelfId} not found for user ${userId}`,
      );
    }

    const shelf = await this.entityManager.findOne(Shelf, {
      where: { id: shelfId, bookshelf: { id: bookshelfId } },
    });

    if (!shelf) {
      throw new NotFoundException(
        `Shelf with id ${shelfId} not found in bookshelf ${bookshelfId}`,
      );
    }

    if (name) {
      shelf.name = name;
    }

    await this.entityManager.save(shelf);

    if (books !== undefined) {
      if (books.length === 0) {
        await this.entityManager.delete('shelfbook', { shelfId: shelf.id });
      } else {
        await this.entityManager.transaction(
          async (transactionalEntityManager) => {
            // Eliminar asociaciones previas
            await transactionalEntityManager.delete('shelfbook', {
              shelfId: shelf.id,
            });

            // Insertar nuevas asociaciones
            const shelfBooks = books.map((bookId) => ({
              shelfId: shelf.id,
              bookId,
            }));
            await transactionalEntityManager.insert('shelfbook', shelfBooks);
          },
        );
      }
    }

    return { message: 'Shelf updated successfully' };
  }

  async deleteShelf(userId: number, bookshelfId: number, shelfId: number) {
    const bookshelf = await this.entityManager.findOne(Bookshelf, {
      where: { id: bookshelfId, user: { id: userId } },
    });

    if (!bookshelf) {
      throw new NotFoundException(
        `Bookshelf with id ${bookshelfId} not found for user ${userId}`,
      );
    }

    const shelf = await this.entityManager.findOne(Shelf, {
      where: { id: shelfId, bookshelf: { id: bookshelfId } },
    });

    if (!shelf) {
      throw new NotFoundException(
        `Shelf with id ${shelfId} not found in bookshelf ${bookshelfId}`,
      );
    }

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete('shelfbook', {
        shelfId: shelf.id,
      });

      await transactionalEntityManager.remove(shelf);
    });

    return { message: 'Shelf deleted successfully' };
  }
}

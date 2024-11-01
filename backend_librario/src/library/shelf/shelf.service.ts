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

import { ValidateUtils } from 'src/common/utils/validate.utils';

@Injectable()
export class ShelfService {
  private readonly validateUtils: ValidateUtils = new ValidateUtils();

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  // -- Create a Shelf

  async createShelf(
    userId: number,
    bookshelfId: number,
    createShelfDto: CreateShelfDto,
  ) {
    const { name, book } = createShelfDto;

    await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: bookshelfId, user: { id: userId } } },
      'bookshelf',
      Bookshelf,
    );

    const newShelf = this.entityManager.create(Shelf, {
      name,
      user: { id: userId },
      bookshelf: { id: bookshelfId },
    });

    const savedShelf = await this.entityManager.save(newShelf);

    if (book && book.length) {
      const userBooks = await this.getUserBooks(userId, book);
      await this.createShelfBooks(savedShelf.id, userBooks);
    }

    return savedShelf;
  }

  private async getUserBooks(
    userId: number,
    bookIds: string[],
  ): Promise<Book[]> {
    const userBooks = await this.entityManager.find(Book, {
      where: { id: In(bookIds), user: { id: userId } },
    });

    if (userBooks.length !== bookIds.length) {
      throw new ForbiddenException('One or more books not found.');
    }

    return userBooks;
  }

  private async createShelfBooks(
    shelfId: number,
    books: Book[],
  ): Promise<void> {
    const shelfBooks = books.map((book) => ({
      shelfId,
      bookId: book.id,
    }));
    await this.entityManager.insert(ShelfBook, shelfBooks);
  }

  // -- Get Shelves for a Bookshelf

  async getShelvesForBookshelf(userId: number, bookshelfId: number) {
    await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: bookshelfId, user: { id: userId } } },
      'Bookshelf',
      Bookshelf,
    );

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

  // -- Get Shelf Details

  async getShelfDetails(userId: number, bookshelfId: number, shelfId: number) {
    const shelf = await this.validateShelf(userId, bookshelfId, shelfId);

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

  private async validateShelf(
    userId: number,
    bookshelfId: number,
    shelfId: number,
  ): Promise<Shelf> {
    await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: bookshelfId, user: { id: userId } } },
      'Bookshelf',
      Bookshelf,
    );

    return await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: shelfId, bookshelf: { id: bookshelfId } } },
      'Shelf',
      Shelf,
    );
  }

  // -- Update a Shelf

  async updateShelf(
    userId: number,
    bookshelfId: number,
    shelfId: number,
    updateShelfDto: UpdateShelfDto,
  ) {
    const shelf = await this.validateShelf(userId, bookshelfId, shelfId);

    if (updateShelfDto.name) {
      await this.updateShelfName(shelf, updateShelfDto.name);
    }

    if (updateShelfDto.books !== undefined) {
      await this.updateShelfBooks(shelf.id, updateShelfDto.books);
    }

    return { message: 'Shelf updated successfully' };
  }

  private async updateShelfName(shelf: Shelf, newName: string): Promise<void> {
    shelf.name = newName;
    await this.entityManager.save(shelf);
  }

  private async updateShelfBooks(
    shelfId: number,
    books: number[],
  ): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // Eliminar asociaciones previas de libros en el shelf
      await transactionalEntityManager.delete('shelfbook', { shelfId });

      // Insertar nuevas asociaciones si `books` no está vacío
      if (books.length > 0) {
        const shelfBooks = books.map((bookId) => ({ shelfId, bookId }));
        await transactionalEntityManager.insert('shelfbook', shelfBooks);
      }
    });
  }

  // -- Delete a Shelf

  async deleteShelf(userId: number, bookshelfId: number, shelfId: number) {
    const shelf = await this.validateShelf(userId, bookshelfId, shelfId);

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete('shelfbook', {
        shelfId: shelf.id,
      });

      await transactionalEntityManager.remove(shelf);
    });

    return { message: 'Shelf deleted successfully' };
  }
}

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UpdateBooksetDto } from './dto/update-bookset.dto';

import { Bookset } from './bookset.entity';
import { BooksetBook } from '../bookset-book/bookset-book.entity';

@Injectable()
export class BooksetService {
  constructor(
    @InjectRepository(Bookset)
    private readonly booksetRepository: Repository<Bookset>,

    private readonly dataSource: DataSource,
  ) {}

  async createBookset(
    userId: number,
    name: string,
    bookIds: number[],
  ): Promise<Bookset> {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne('User', { where: { id: userId } });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const newBookset = await manager.getRepository(Bookset).save({
        name,
        user: { id: userId },
      });

      const booksetBooks = bookIds.map((bookId) => ({
        booksetId: newBookset.id,
        bookId,
      }));

      await manager.getRepository(BooksetBook).save(booksetBooks);

      return {
        ...newBookset,
        books: bookIds,
      };
    });
  }

  async getUserBooksets(userId: number) {
    const booksets = await this.booksetRepository
      .createQueryBuilder('bookset')
      .leftJoinAndSelect('bookset.booksetBooks', 'booksetBooks')
      .select([
        'bookset.id AS id',
        'bookset.name AS name',
        'COUNT(booksetBooks.bookId) AS bookQuantity',
      ])
      .where('bookset.userId = :userId', { userId })
      .groupBy('bookset.id')
      .getRawMany();

    return booksets;
  }

  async getBooksetDetails(userId: number, booksetId: number) {
    const bookset = await this.booksetRepository
      .createQueryBuilder('bookset')
      .leftJoinAndSelect('bookset.booksetBooks', 'booksetBooks')
      .leftJoinAndSelect('booksetBooks.book', 'book')
      .select([
        'bookset.id AS id',
        'bookset.name AS name',
        'book.id AS bookId',
        'book.title AS bookTitle',
        'book.author AS bookAuthor',
      ])
      .where('bookset.id = :booksetId', { booksetId })
      .andWhere('bookset.userId = :userId', { userId })
      .getRawMany();

    if (bookset.length === 0) {
      throw new NotFoundException(
        'Bookset not found or does not belong to this user',
      );
    }

    const books = bookset
      .filter((item) => item.bookId !== null)
      .map((item) => ({
        id: item.bookId,
        title: item.bookTitle,
        author: item.bookAuthor,
      }));

    return {
      id: bookset[0].id,
      name: bookset[0].name,
      books,
    };
  }

  async updateBookset(
    userId: number,
    booksetId: number,
    updateData: UpdateBooksetDto,
  ) {
    const { name, book: book } = updateData;

    return this.dataSource.transaction(async (manager) => {
      const booksetRepository = manager.getRepository(Bookset);
      const booksetBookRepository = manager.getRepository(BooksetBook);

      const bookset = await booksetRepository.findOne({
        where: { id: booksetId, user: { id: userId } },
      });

      if (!bookset) {
        throw new NotFoundException(
          'Bookset not found or does not belong to user',
        );
      }

      bookset.name = name;
      await booksetRepository.save(bookset);

      if (book !== undefined) {
        if (book.length === 0) {
          // Eliminar todas las relaciones si el arreglo está vacío
          await booksetBookRepository.delete({ booksetId: booksetId });
        } else {
          // Eliminar todas las relaciones actuales con los libros antes de agregar nuevas
          await booksetBookRepository.delete({ booksetId: booksetId });

          // Crear nuevas relaciones solo si hay IDs en el arreglo `books`
          const booksetBooks = book.map((bookId) => ({
            booksetId: booksetId,
            bookId,
          }));
          await booksetBookRepository.insert(booksetBooks);
        }
      }

      return {
        id: bookset.id,
        name: bookset.name,
        books: book,
      };
    });
  }

  async deleteBookset(userId: number, booksetId: number) {
    return this.dataSource.transaction(async (manager) => {
      const booksetRepository = manager.getRepository(Bookset);

      const bookset = await booksetRepository.findOne({
        where: { id: booksetId, user: { id: userId } },
      });

      if (!bookset) {
        throw new NotFoundException(
          'Bookset not found or does not belong to user',
        );
      }

      await booksetRepository.remove(bookset);

      return { message: 'Bookset deleted successfully' };
    });
  }
}

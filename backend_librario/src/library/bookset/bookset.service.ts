import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';

import { UpdateBooksetDto } from './dto/update-bookset.dto';

import { Bookset } from './bookset.entity';
import { BooksetBook } from '../bookset-book/bookset-book.entity';
import { Book } from '../book/book.entity';

import { ValidateUtils } from 'src/common/utils/validate.utils';
import { BooksetPreviewDto } from './dto/bookset-preview.dto';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class BooksetService {
  private readonly validateUtils = new ValidateUtils();

  constructor(
    @InjectRepository(Bookset)
    private readonly booksetRepository: Repository<Bookset>,

    private readonly dataSource: DataSource,
  ) {}

  // -- Create a bookset

  async createBookset(
    userId: number,
    name: string,
    bookIds: number[],
  ): Promise<Bookset> {
    return await this.dataSource.transaction(async (manager) => {
      const newBookset = await manager.getRepository(Bookset).save({
        name,
        user: { id: userId },
      });

      const userBooks = await manager.find('Book', {
        where: { id: In(bookIds.map(Number)), user: { id: userId } },
      });

      if (userBooks.length !== bookIds.length) {
        throw new HttpException('One or more books not found', 403);
      }

      const booksetBooks = userBooks.map((userBook) => ({
        booksetId: newBookset.id,
        bookId: userBook.id,
      }));

      await manager.getRepository(BooksetBook).save(booksetBooks);

      return {
        ...newBookset,
        books: bookIds,
      };
    });
  }

  // -- Get bookset preview

  async getBooksetPreview(userId: number) {
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

  // -- Get bookset details

  async getBooksetDetails(userId: number, booksetId: number) {
    const bookset = await this.fetchBooksetDetails(userId, booksetId);

    if (bookset.length === 0) {
      throw new NotFoundException('Bookset not found.');
    }

    return this.formatBooksetDetails(bookset);
  }

  private async fetchBooksetDetails(userId: number, booksetId: number) {
    return await this.booksetRepository
      .createQueryBuilder('bookset')
      .leftJoin('bookset.booksetBooks', 'booksetBooks')
      .leftJoin('booksetBooks.book', 'book')
      .select([
        'bookset.id AS id',
        'bookset.name AS name',
        'book.id AS bookId',
        'book.title AS bookTitle',
        'book.author AS bookAuthor',
        'book.coverUrl AS coverUrl',
      ])
      .where('bookset.id = :booksetId', { booksetId })
      .andWhere('bookset.userId = :userId', { userId })
      .getRawMany();
  }

  private formatBooksetDetails(bookset: any[]): BooksetPreviewDto {
    const books = bookset
      .filter((item) => item.bookId !== null)
      .map((item) => ({
        id: item.bookId,
        title: item.bookTitle,
        author: item.bookAuthor,
        cover: item.coverUrl,
      }));

    return {
      id: bookset[0].id,
      name: bookset[0].name,
      books,
    };
  }

  // -- Uupdate a bookset

  async updateBookset(
    userId: number,
    booksetId: number,
    updateData: UpdateBooksetDto,
  ) {
    const { name, book } = updateData;

    return this.dataSource.transaction(async (manager) => {
      const bookset = await this.validateUtils.findByRepository(
        manager,
        {
          where: { id: booksetId, user: { id: userId } },
        },
        'Bookset',
        Bookset,
      );

      await this.updateBooksetName(manager, bookset, name);

      if (book !== undefined) {
        await this.updateBooksetBooks(manager, userId, booksetId, book);
      }

      return {
        id: bookset.id,
        name: bookset.name,
        books: book,
      };
    });
  }

  private async updateBooksetName(
    manager: EntityManager,
    bookset: Bookset,
    name: string,
  ) {
    bookset.name = name;
    await manager.getRepository(Bookset).save(bookset);
  }

  private async validateBooksOwnership(
    manager: EntityManager,
    userId: number,
    bookIds: number[],
  ) {
    const books = await manager
      .getRepository(Book)
      .createQueryBuilder('book')
      .where('book.id IN (:...bookIds)', { bookIds })
      .andWhere('book.userId = :userId', { userId })
      .getMany();

    if (books.length !== bookIds.length) {
      throw new NotFoundException('One or more books not found.');
    }
  }

  private async updateBooksetBooks(
    manager: EntityManager,
    userId: number,
    booksetId: number,
    bookIds: number[],
  ) {
    const booksetBookRepository = manager.getRepository(BooksetBook);

    if (bookIds.length === 0) {
      await booksetBookRepository.delete({ booksetId });
    } else {
      await this.validateBooksOwnership(manager, userId, bookIds);

      await booksetBookRepository.delete({ booksetId });
      const booksetBooks = bookIds.map((bookId) => ({ booksetId, bookId }));
      await booksetBookRepository.insert(booksetBooks);
    }
  }

  // -- Delete a bookset

  async deleteBookset(userId: number, booksetId: number): Promise<MessageResponse> {
    return this.dataSource.transaction(async (manager) => {
      const booksetRepository = manager.getRepository(Bookset);

      const bookset = await this.validateUtils.findByRepository(
        booksetRepository,
        { where: { id: booksetId, user: { id: userId } } },
        'Bookset',
      );

      await booksetRepository.remove(bookset);

      return {
        message: 'Bookset deleted successfully.',
        statusCode: 200,
      }
    });
  }
}

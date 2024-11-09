import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Reading } from './reading.entity';
import { CreateReadingDto } from './dto/create-read.dto';
import { Book } from 'src/library/book/book.entity';
import { UpdateReadingDto } from './dto/update-read.dto';
import { RequestBookSummaryDto } from './dto/request-book-summary.dto';
import { ValidateUtils } from 'src/common/utils/validate.utils';

@Injectable()
export class ReadingsService {
  private readonly validity = new ValidateUtils();

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async createReading(
    userId: number,
    createReadingDto: CreateReadingDto,
  ): Promise<Reading> {
    const { book, currentPage, startReadingDate } = createReadingDto;
    const date = new Date(startReadingDate);

    const userBook = await this.validity.findByRepository(
      this.bookRepository,
      {
        where: {
          id: Number(book),
          user: { id: userId },
        },
      },
      'Book',
    );

    if (currentPage > userBook.pages) {
      throw new HttpException(
        'Current page is greater than total pages',
        HttpStatus.BAD_REQUEST,
      );
    }

    let endReadingDate = null;
    if (currentPage === userBook.pages) {
      endReadingDate = new Date();
    }

    const newReading = this.entityManager.create(Reading, {
      book: userBook,
      user: { id: userId },
      currentPage,
      startReadingDate: isNaN(date.getTime()) ? new Date() : date,
      endReadingDate,
    });

    return await this.entityManager.save(newReading);
  }

  async getAllReadings(userId: number) {
    const readings = await this.entityManager
      .createQueryBuilder(Reading, 'reading')
      .leftJoinAndSelect('reading.book', 'book')
      .select([
        'reading.id AS id',
        'book.title AS title',
        'book.author AS author',
        'reading.currentPage AS currentPage',
        'book.pages AS totalPages',
        'book.coverUrl AS cover',
        'ROUND((reading.currentPage / book.pages) * 100, 2) AS percentage',
      ])
      .where('reading.userId = :userId', { userId })
      .getRawMany();

    return readings.map((reading) => ({
      id: reading.id,
      title: reading.title,
      author: reading.author,
      cover: reading.cover,
      currentPage: reading.currentPage,
      totalPages: reading.totalPages,
      percentage: Number(reading.percentage),
    }));
  }

  async getBookSummary(
    bookId: number,
    userId: number,
  ): Promise<RequestBookSummaryDto> {
    const book = await this.validity.findByRepository(
      this.bookRepository,
      {
        where: { id: bookId, user: { id: userId } },
        select: ['id', 'title', 'author', 'pages', 'coverUrl'],
      },
      'Book',
    );

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      totalPages: book.pages,
      cover: book.coverUrl,
    };
  }

  async getReadingDetails(userId: number, readingId: number) {
    const reading = await this.entityManager
      .createQueryBuilder(Reading, 'reading')
      .leftJoinAndSelect('reading.book', 'book')
      .select([
        'reading.id AS id',
        'book.title AS title',
        'book.author AS author',
        'book.coverUrl AS cover',
        'reading.currentPage AS currentPage',
        'book.pages AS totalPages',
        'ROUND((reading.currentPage / book.pages) * 100, 2) AS percentage',
        'reading.rate AS rate',
        'reading.review AS review',
        'reading.startReadingDate AS startReadingDate',
        'reading.endReadingDate AS endReadingDate',
      ])
      .where('reading.userId = :userId', { userId })
      .andWhere('reading.id = :readingId', { readingId })
      .getRawOne();

    if (!reading) {
      throw new NotFoundException(`Reading not found`);
    }

    return {
      id: reading.id,
      title: reading.title,
      author: reading.author,
      cover: reading.cover,
      currentPage: reading.currentPage,
      totalPages: reading.totalPages,
      percentage: Number(reading.percentage),
      rate: reading.rate,
      review: reading.review,
      startReadingDate: reading.startReadingDate,
      endReadingDate: reading.endReadingDate,
    };
  }

  async updateReading(
    userId: number,
    readingId: number,
    updateReadingDto: UpdateReadingDto,
  ): Promise<Reading> {
    const reading = await this.validity.findByRepository(
      this.entityManager,
      {
        where: { id: readingId, user: { id: userId } },
        relations: ['book'],
      },
      'Reading',
      Reading,
    );

    if (updateReadingDto.currentPage > reading.book.pages) {
      throw new HttpException(
        'Current page is greater than total pages',
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(reading, updateReadingDto);

    if (
      updateReadingDto.currentPage &&
      reading.currentPage === reading.book.pages
      && !reading.endReadingDate
    ) {
      reading.endReadingDate = new Date(
        reading.endReadingDate.getUTCMonth(),
        reading.endReadingDate.getUTCDate(),
        reading.endReadingDate.getUTCFullYear(),
      );
    }

    return await this.entityManager.save(reading);
  }

  async deleteReading(userId: number, readingId: number): Promise<Reading> {
    const reading = await this.validity.findByRepository(
      this.entityManager,
      {
        where: { id: readingId, user: { id: userId } },
      },
      'Reading',
      Reading,
    );

    return await this.entityManager.remove(reading);
  }
}

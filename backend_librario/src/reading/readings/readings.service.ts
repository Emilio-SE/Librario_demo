import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Reading } from './reading.entity';
import { CreateReadingDto } from './dto/create-read.dto';
import { Book } from 'src/library/book/book.entity';
import { UpdateReadingDto } from './dto/update-read.dto';
import { RequestBookSummaryDto } from './dto/request-book-summary.dto';

@Injectable()
export class ReadingsService {
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

    const userBook = await this.entityManager.findOne(Book, {
      where: {
        id: Number(book),
        user: { id: userId },
      },
    });

    if (!userBook) {
      throw new NotFoundException(
        `Book with id ${book} not found for user ${userId}`,
      );
    }

    const newReading = this.entityManager.create(Reading, {
      book: userBook,
      user: { id: userId },
      currentPage,
      startReadingDate: isNaN(date.getTime()) ? new Date() : date,
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
        'ROUND((reading.currentPage / book.pages) * 100, 2) AS percentage',
      ])
      .where('reading.userId = :userId', { userId })
      .getRawMany();

    return readings.map((reading) => ({
      id: reading.id,
      title: reading.title,
      author: reading.author,
      currentPage: reading.currentPage,
      totalPages: reading.totalPages,
      percentage: Number(reading.percentage),
    }));
  }

  async getBookSummary(
    bookId: number,
    userId: number,
  ): Promise<RequestBookSummaryDto> {
    
    console.log('bookId', bookId, 'userId', userId);
    const book = await this.bookRepository.findOne({
      where: { id: bookId, user: { id: userId } },
      select: ['id', 'title', 'author', 'pages'],
    });

    if (!book) {
      throw new NotFoundException(
        `Book with id ${bookId} not found for user ${userId}`,
      );
    }

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      totalPages: book.pages,
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
      throw new NotFoundException(
        `Reading with id ${readingId} not found for user ${userId}`,
      );
    }

    return {
      id: reading.id,
      title: reading.title,
      author: reading.author,
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
    const reading = await this.entityManager.findOne(Reading, {
      where: { id: readingId, user: { id: userId } },
    });

    if (!reading) {
      throw new NotFoundException(
        `Reading with id ${readingId} not found for user ${userId}`,
      );
    }

    Object.assign(reading, updateReadingDto);

    return await this.entityManager.save(reading);
  }

  async deleteReading(userId: number, readingId: number): Promise<Reading> {
    const reading = await this.entityManager.findOne(Reading, {
      where: { id: readingId, user: { id: userId } },
    });

    if (!reading) {
      throw new NotFoundException(
        `Reading with id ${readingId} not found for user ${userId}`,
      );
    }

    return await this.entityManager.remove(reading);
  }
}

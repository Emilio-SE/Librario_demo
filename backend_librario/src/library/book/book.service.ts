import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';

import { Book } from './book.entity';
import { BookGenre } from '../book-genre/book-genre.entity';
import { BookTag } from '../book-tag/book-tag.entity';
import { BooksetBook } from '../bookset-book/bookset-book.entity';

import { CreateBookDto } from './dto/create-book.dto';
import { BookPreviewDto } from './dto/book-preview.dto';
import { BookDetailsDto } from './dto/book-details.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { MessageResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class BookService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async createBook(
    createBookDto: CreateBookDto,
    userId: number,
  ): Promise<Book> {
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const { genre, tag, bookset, ...bookData } = createBookDto;

        const newBook = this.bookRepository.create({
          ...bookData,
          user: { id: userId },
        });
        const savedBook = await transactionalEntityManager.save(newBook);

        // Insertar relaciones en BookGenre
        if (genre && genre.length) {
          const bookGenres = genre.map((genreId) => ({
            bookId: savedBook['id'],
            genreId,
          }));
          await transactionalEntityManager.insert(BookGenre, bookGenres);
        }

        // Insertar relaciones en BookTag
        if (tag && tag.length) {
          const bookTags = tag.map((tagId) => ({
            bookId: savedBook['id'],
            tagId,
          }));
          await transactionalEntityManager.insert(BookTag, bookTags);
        }

        // Insertar relaciones en BooksetBook
        if (bookset && bookset.length) {
          const booksetBooks = bookset.map((booksetId) => ({
            booksetId,
            bookId: savedBook.id,
          }));
          await transactionalEntityManager.insert(BooksetBook, booksetBooks);
        }

        return savedBook;
      },
    );
  }

  async getBookSummaries(userId: number): Promise<BookPreviewDto[]> {
    return await this.bookRepository
      .createQueryBuilder('book')
      .select(['book.id', 'book.title', 'book.author'])
      .where('book.user = :userId', { userId })
      .getRawMany();
  }

  async getBookDetails(
    bookId: number,
    userId: number,
  ): Promise<BookDetailsDto> {
    const book = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.bookGenres', 'bookgenre')
      .leftJoin('book.bookTags', 'booktag')
      .leftJoin('book.shelfBooks', 'shelfbook')
      .leftJoin('shelfbook.shelf', 'shelf')
      .leftJoin('shelf.bookshelf', 'bookshelf')
      .leftJoin('book.booksetBooks', 'booksetbook')
      .select([
        'book.id',
        'book.title',
        'book.author',
        'book.isbn',
        'book.description',
        'book.publisher',
        'book.edition',
        'book.language',
        'book.pages',
        'book.publicationdate',
        'book.formatId',
        'book.price',
        'book.asexpense',
        'GROUP_CONCAT(DISTINCT bookgenre.genreid) AS genres',
        'GROUP_CONCAT(DISTINCT booktag.tagid) AS tags',
        'GROUP_CONCAT(DISTINCT CONCAT_WS(":", bookshelf.id, shelf.id)) AS bookshelf_shelf',
        'GROUP_CONCAT(DISTINCT booksetbook.booksetid) AS booksets',
      ])
      .where('book.id = :bookId', { bookId })
      .andWhere('book.userId = :userId', { userId })
      .groupBy('book.id')
      .getRawOne();

    if (!book) {
      throw new NotFoundException(
        'Book not found or does not belong to this user',
      );
    }

    const bookshelfShelves = book.bookshelf_shelf
      ? book.bookshelf_shelf.split(',').reduce((acc, item) => {
          const [bookshelfId, shelfId] = item.split(':').map(Number);
          const existingBookshelf = acc.find(
            (b) => b.bookshelfId === bookshelfId,
          );
          if (existingBookshelf) {
            existingBookshelf.shelves.push(shelfId);
          } else {
            acc.push({ bookshelfId, shelves: [shelfId] });
          }
          return acc;
        }, [])
      : [];

    console.log('bookshelfShelves', book);

    delete book.bookshelf_shelf;

    return {
      ...book,
      genres: book.genres ? book.genres.split(',').map(Number) : [],
      tags: book.tags ? book.tags.split(',').map(Number) : [],
      bookshelfShelves,
      booksets: book.booksets ? book.booksets.split(',').map(Number) : [],
    };
  }

  async updateBook(
    bookId: number,
    userId: number,
    updateData: UpdateBookDto,
  ): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId, user: { id: userId } },
      relations: ['bookGenres', 'bookTags', 'shelfBooks', 'booksetBooks'],
    });

    if (!book) {
      throw new NotFoundException(
        'Book not found or does not belong to this user',
      );
    }

    Object.assign(book, updateData);
    await this.bookRepository.save(book);

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      if (updateData.genre) {
        await transactionalEntityManager.delete(BookGenre, {
          bookId: bookId,
          genreId: Not(In(updateData.genre)),
        });

        const existingGenres = book.bookGenres.map((bg) => bg.genreId);

        const newGenres = updateData.genre.filter(
          (genreId) => !existingGenres.includes(genreId),
        );

        const bookGenresToInsert = newGenres.map((genreId) => ({
          bookId,
          genreId,
        }));
        if (bookGenresToInsert.length > 0) {
          await transactionalEntityManager.insert(
            BookGenre,
            bookGenresToInsert,
          );
        }
      }

      if (updateData.tag) {
        await transactionalEntityManager.delete(BookTag, {
          bookId: bookId,
          tagId: Not(In(updateData.tag)),
        });

        const existingTags = book.bookTags.map((bt) => bt.tagId);
        const newTags = updateData.tag.filter(
          (tagId) => !existingTags.includes(tagId),
        );
        const bookTagsToInsert = newTags.map((tagId) => ({
          bookId,
          tagId,
        }));
        if (bookTagsToInsert.length > 0) {
          await transactionalEntityManager.insert(BookTag, bookTagsToInsert);
        }
      }

      if (updateData.bookset) {
        await transactionalEntityManager.delete(BooksetBook, {
          bookId: bookId,
          booksetId: Not(In(updateData.bookset)),
        });

        const existingBooksets = book.booksetBooks.map((bb) => bb.booksetId);
        const newBooksets = updateData.bookset.filter(
          (booksetId) => !existingBooksets.includes(booksetId),
        );
        const booksetsToInsert = newBooksets.map((booksetId) => ({
          booksetId,
          bookId,
        }));
        if (booksetsToInsert.length > 0) {
          await transactionalEntityManager.insert(
            BooksetBook,
            booksetsToInsert,
          );
        }
      }
    });

    return book;
  }

  async deleteBook(bookId: number, userId: number): Promise<MessageResponse> {
    return await this.dataSource.transaction(async (entityManager) => {
      const book = await entityManager.findOne(Book, {
        where: { id: bookId, user: { id: userId } },
      });
      console.log('book', book);
      if (!book) {
        throw new NotFoundException(
          'Book not found or does not belong to this user',
        );
      }

      //await entityManager.delete(BookGenre, { bookId: book.id });
      //await entityManager.delete(BookTag, { bookId: book.id });
      //await entityManager.delete(ShelfBook, { bookId: book.id });
      //await entityManager.delete(BooksetBook, { bookId: book.id });

      await entityManager.delete(Book, book.id);

      return {
        message: 'Book deleted successfully',
      };
    });
  }
}

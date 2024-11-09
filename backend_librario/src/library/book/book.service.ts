import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Book } from './book.entity';
import { BookGenre } from '../book-genre/book-genre.entity';
import { BookTag } from '../book-tag/book-tag.entity';
import { BooksetBook } from '../bookset-book/bookset-book.entity';

import { CreateBookDto } from './dto/create-book.dto';
import { BookPreviewDto } from './dto/book-preview.dto';
import { BookDetailsDto } from './dto/book-details.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { ValidateUtils } from 'src/common/utils/validate.utils';

import { MessageResponse } from 'src/common/interfaces/response.interface';

import axios from 'axios';

@Injectable()
export class BookService {
  private readonly validateUtils = new ValidateUtils();

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  private async findAndValidateBook(
    bookId: number,
    userId: number,
  ): Promise<Book> {
    return await this.validateUtils.findByRepository(
      this.bookRepository,
      {
        where: { id: bookId, user: { id: userId } },
        relations: ['bookGenres', 'bookTags', 'shelfBooks', 'booksetBooks'],
      },
      'Book',
    );
  }

  // --- Create operation ---

  async createBook(
    createBookDto: CreateBookDto,
    userId: number,
  ): Promise<Book> {
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const { genre, tag, bookset, ...bookData } = createBookDto;

        bookData.acquisitionDate =
          bookData.acquisitionDate.toString().length > 0
            ? (bookData.acquisitionDate = new Date(bookData.acquisitionDate))
            : null;

        bookData.publicationDate =
          bookData.publicationDate.toString().length > 0
            ? (bookData.publicationDate = new Date(bookData.publicationDate))
            : undefined;

        bookData.asExpense = !!bookData.asExpense;

        const newBook = this.bookRepository.create({
          ...bookData,
          user: { id: userId },
        });
        const savedBook = await transactionalEntityManager.save(newBook);

        const insertRelations = async (Entity, ids, fieldNames) => {
          if (ids && ids.length) {
            const entities = ids.map((id) => ({
              [fieldNames.bookField]: savedBook.id,
              [fieldNames.relatedField]: id,
            }));
            await transactionalEntityManager.insert(Entity, entities);
          }
        };

        await insertRelations(BookGenre, genre, {
          bookField: 'bookId',
          relatedField: 'genreId',
        });
        await insertRelations(BookTag, tag, {
          bookField: 'bookId',
          relatedField: 'tagId',
        });
        await insertRelations(BooksetBook, bookset, {
          bookField: 'bookId',
          relatedField: 'booksetId',
        });

        return savedBook;
      },
    );
  }

  public async getBookDetailsByISBN(isbn: string): Promise<BookPreviewDto> {
    try {
      const response = await axios.get(
        `https://openlibrary.org/isbn/${isbn}.json`,
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener datos del libro');
    }
  }

  // --- Read preview operations ---

  async getBookPreview(userId: number): Promise<BookPreviewDto[]> {
    return await this.bookRepository
      .createQueryBuilder('book')
      .select(['book.id', 'book.title', 'book.author', 'book.coverUrl'])
      .where('book.user = :userId', { userId })
      .getMany();
  }

  // --- Read details operations --

  async getBookDetails(
    bookId: number,
    userId: number,
  ): Promise<BookDetailsDto> {
    const book = await this.fetchBookDetails(bookId, userId);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  private async fetchBookDetails(
    bookId: number,
    userId: number,
  ): Promise<BookDetailsDto | undefined> {
    const rawBook = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.bookGenres', 'bookgenre')
      .leftJoin('bookgenre.genre', 'genre')
      .leftJoin('book.bookTags', 'booktag')
      .leftJoin('booktag.tag', 'tag')
      .leftJoin('book.format', 'format')
      .leftJoin('book.shelfBooks', 'shelfbook')
      .leftJoin('shelfbook.shelf', 'shelf')
      .leftJoin('shelf.bookshelf', 'bookshelf')
      .leftJoin('book.booksetBooks', 'booksetbook')
      .leftJoin('booksetbook.bookset', 'bookset')
      .select([
        'book.id AS id',
        'book.title AS title',
        'book.author AS author',
        'book.isbn AS isbn',
        'book.description AS description',
        'book.publisher AS publisher',
        'book.edition AS edition',
        'book.language AS language',
        'book.pages AS pages',
        'book.publicationdate AS publicationDate',
        'book.acquisitiondate AS acquisitionDate',
        'book.formatId AS formatId',
        'book.price AS price',
        'book.asexpense AS asExpense',
        'book.coverUrl AS coverUrl',
        'GROUP_CONCAT(DISTINCT CONCAT(bookgenre.genreid, ":", genre.name)) AS genres',
        'GROUP_CONCAT(DISTINCT CONCAT(booktag.tagid, ":", tag.name)) AS tags',
        'GROUP_CONCAT(DISTINCT CONCAT(bookshelf.id, ":", bookshelf.name, ":", shelf.id, ":", shelf.name)) AS bookshelf_shelf',
        'GROUP_CONCAT(DISTINCT CONCAT(booksetbook.booksetid, ":", bookset.name)) AS booksets',
        'GROUP_CONCAT(DISTINCT CONCAT(format.id, ":", format.name)) AS format',
      ])
      .where('book.id = :bookId', { bookId })
      .andWhere('book.userId = :userId', { userId })
      .groupBy('book.id')
      .getRawOne();

    return rawBook ? this.formatBookDetails(rawBook) : undefined;
  }

  private formatBookDetails(book: any): BookDetailsDto {
    const genres = this.parseIdNameString(book.genres);
    const tags = this.parseIdNameString(book.tags);
    const booksets = this.parseIdNameString(book.booksets);
    const bookshelfShelves = this.parseBookshelfShelves(book.bookshelf_shelf);
    const format = this.parseIdNameString(book.format)[0];

    return {
      ...book,
      genres,
      tags,
      bookshelfShelves,
      booksets,
      format,
    };
  }

  private parseIdNameString(
    idNameString: string | null,
  ): Array<{ id: number; name: string }> {
    if (!idNameString || typeof idNameString !== 'string') return [];
    const uniqueEntries = new Set(
      idNameString.split(',').map((item) => {
        const [id, name] = item.split(':');
        return JSON.stringify({ id: Number(id), name });
      }),
    );

    return Array.from(uniqueEntries).map((entry) => JSON.parse(entry));
  }

  private parseBookshelfShelves(bookshelfShelf: string | null): Array<{
    bookshelf: { id: number; name: string };
    shelves: { id: number; name: string }[];
  }> {
    if (!bookshelfShelf) return [];
    return bookshelfShelf.split(',').reduce((acc, item) => {
      const [bookshelfId, bookshelfName, shelfId, shelfName] = item.split(':');
      const bookshelf = acc.find((b) => b.bookshelf.id === Number(bookshelfId));

      const shelf = { id: Number(shelfId), name: shelfName };
      if (bookshelf) {
        bookshelf.shelves.push(shelf);
      } else {
        acc.push({
          bookshelf: { id: Number(bookshelfId), name: bookshelfName },
          shelves: [shelf],
        });
      }
      return acc;
    }, []);
  }

  // --- Update operation ---

  async updateBook(
    bookId: number,
    userId: number,
    updateData: UpdateBookDto,
  ): Promise<Book> {
    const book = await this.findAndValidateBook(bookId, userId);

    await this.updateBookProperties(book, updateData);

    await this.updateBookRelations(bookId, updateData, book);

    return book;
  }

  private async updateBookProperties(
    book: Book,
    updateData: UpdateBookDto,
  ): Promise<void> {
    updateData.acquisitionDate =
      updateData.acquisitionDate.toString().length > 0
        ? (updateData.acquisitionDate = new Date(updateData.acquisitionDate))
        : null;

    updateData.publicationDate =
      updateData.publicationDate.toString().length > 0
        ? (updateData.publicationDate = new Date(updateData.publicationDate))
        : undefined;

    updateData.asExpense = !!updateData.asExpense;

    Object.assign(book, updateData);
    await this.bookRepository.save(book);
  }

  private async updateBookRelations(
    bookId: number,
    updateData: UpdateBookDto,
    book: Book,
  ): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Eliminar y actualizar BookGenre
      if (updateData.genre) {
        await transactionalEntityManager.delete(BookGenre, { bookId });
        const bookGenres = [...new Set(updateData.genre)].map((genreId) => ({
          bookId,
          genreId,
        }));
        await transactionalEntityManager.insert(BookGenre, bookGenres);
      }

      // Eliminar y actualizar BookTag
      if (updateData.tag) {
        await transactionalEntityManager.delete(BookTag, { bookId });
        const bookTags = [...new Set(updateData.tag)].map((tagId) => ({
          bookId,
          tagId,
        }));
        await transactionalEntityManager.insert(BookTag, bookTags);
      }

      // Eliminar y actualizar BooksetBook
      if (updateData.bookset) {
        await transactionalEntityManager.delete(BooksetBook, { bookId });
        const booksetBooks = [...new Set(updateData.bookset)].map(
          (booksetId) => ({
            booksetId,
            bookId,
          }),
        );
        await transactionalEntityManager.insert(BooksetBook, booksetBooks);
      }
    });
  }

  // --- Delete operation ---

  async deleteBook(bookId: number, userId: number): Promise<MessageResponse> {
    return await this.dataSource.transaction(async (entityManager) => {
      const book = await this.findAndValidateBook(bookId, userId);

      const result = await entityManager.delete(Book, book.id);

      if (result.affected === 0) {
        throw new NotFoundException('Book not affected');
      } else {
        return {
          message: 'Book deleted successfully',
          statusCode: 200,
        };
      }
    });
  }
}

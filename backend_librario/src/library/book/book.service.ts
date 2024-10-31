import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

import { ValidateUtils } from 'src/common/utils/validate.utils';

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

  // --- Read preview operations ---

  async getBookPreview(userId: number): Promise<BookPreviewDto[]> {
    return await this.bookRepository
      .createQueryBuilder('book')
      .select(['book.id', 'book.title', 'book.author', 'book.coverUrl'])
      .where('book.user = :userId', { userId })
      .getRawMany();
  }

  // --- Read details operations --

  async getBookDetails(
    bookId: number,
    userId: number,
  ): Promise<BookDetailsDto> {
    const book = await this.fetchBookDetails(bookId, userId);
    console.log(book);
    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return this.formatBookDetails(book);
  }

  private async fetchBookDetails(
    bookId: number,
    userId: number,
  ): Promise<BookDetailsDto | undefined> {
    return await this.bookRepository
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
        'book.acquisitiondate',
        'book.formatId',
        'book.price',
        'book.asexpense',
        'book.coverUrl',
        'GROUP_CONCAT(DISTINCT bookgenre.genreid) AS genres',
        'GROUP_CONCAT(DISTINCT booktag.tagid) AS tags',
        'GROUP_CONCAT(DISTINCT CONCAT_WS(":", bookshelf.id, shelf.id)) AS bookshelf_shelf',
        'GROUP_CONCAT(DISTINCT booksetbook.booksetid) AS booksets',
      ])
      .where('book.id = :bookId', { bookId })
      .andWhere('book.userId = :userId', { userId })
      .groupBy('book.id')
      .getRawOne();
  }

  private formatBookDetails(book: any): BookDetailsDto {
    return {
      ...book,
      genres: this.parseIdsString(book.genres),
      tags: this.parseIdsString(book.tags),
      bookshelfShelves: this.parseBookshelfShelves(book.bookshelf_shelf),
      booksets: this.parseIdsString(book.booksets),
    };
  }

  private parseBookshelfShelves(
    bookshelfShelf: string,
  ): Array<{ bookshelfId: number; shelves: number[] }> {
    if (!bookshelfShelf) return [];
    return bookshelfShelf.split(',').reduce((acc, item) => {
      const [bookshelfId, shelfId] = item.split(':').map(Number);
      const bookshelf = acc.find((b) => b.bookshelfId === bookshelfId);
      bookshelf
        ? bookshelf.shelves.push(shelfId)
        : acc.push({ bookshelfId, shelves: [shelfId] });
      return acc;
    }, []);
  }

  private parseIdsString(idsString: string | null): number[] {
    return idsString ? idsString.split(',').map(Number) : [];
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

  async deleteBook(bookId: number, userId: number): Promise<HttpStatus> {
    return await this.dataSource.transaction(async (entityManager) => {
      const book = await this.findAndValidateBook(bookId, userId);

      const result = await entityManager.delete(Book, book.id);

      if (result.affected === 0) {
        throw new NotFoundException('Book not affected');
      } else {
        return HttpStatus.OK;
      }
    });
  }
}

import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../book/book.entity';
import { Genre } from '../category/category.entity';

@Entity({ name: 'bookgenre' })
export class BookGenre {
  @PrimaryColumn()
  bookId: number;

  @PrimaryColumn()
  genreId: number;

  @ManyToOne(() => Book, book => book.bookGenres, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => Genre, genre => genre.bookGenres, { onDelete: 'CASCADE' })
  genre: Genre;
}

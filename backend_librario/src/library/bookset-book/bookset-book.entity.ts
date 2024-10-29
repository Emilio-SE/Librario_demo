import { Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Bookset } from '../bookset/bookset.entity';
import { Book } from '../book/book.entity';

@Entity({ name: 'booksetbook' })
export class BooksetBook {
  @PrimaryColumn()
  booksetId: number;

  @PrimaryColumn()
  bookId: number;

  @ManyToOne(() => Bookset, bookset => bookset.booksetBooks, { onDelete: 'CASCADE' })
  bookset: Bookset;

  @ManyToOne(() => Book, book => book.booksetBooks, { onDelete: 'CASCADE' })
  book: Book;
}

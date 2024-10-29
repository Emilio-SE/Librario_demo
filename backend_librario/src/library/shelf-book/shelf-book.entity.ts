import { Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Shelf } from '../shelf/shelf.entity';
import { Book } from '../book/book.entity';

@Entity({ name: 'shelfbook' })
export class ShelfBook {
  @PrimaryColumn()
  shelfId: number;

  @PrimaryColumn()
  bookId: number;

  @ManyToOne(() => Shelf, shelf => shelf.shelfBooks, { onDelete: 'CASCADE' })
  shelf: Shelf;

  @ManyToOne(() => Book, book => book.shelfBooks, { onDelete: 'CASCADE' })
  book: Book;
}

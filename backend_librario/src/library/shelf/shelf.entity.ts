import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/account/user/user.entity';
import { Bookshelf } from '../bookshelf/bookshelf.entity';
import { ShelfBook } from '../shelf-book/shelf-book.entity';

@Entity({ name: 'shelf' })
export class Shelf {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.shelves, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Bookshelf, bookshelf => bookshelf.shelves, { onDelete: 'CASCADE' })
  bookshelf: Bookshelf;

  @OneToMany(() => ShelfBook, shelfBook => shelfBook.shelf)
  shelfBooks: ShelfBook[];
}

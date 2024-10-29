import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/account/user/user.entity';
import { BooksetBook } from '../bookset-book/bookset-book.entity';

@Entity({ name: 'bookset' })
export class Bookset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.booksets, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => BooksetBook, booksetBook => booksetBook.bookset)
  booksetBooks: BooksetBook[];
}

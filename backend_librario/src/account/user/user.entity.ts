import { Book } from 'src/library/book/book.entity';
import { Bookset } from 'src/library/bookset/bookset.entity';
import { Bookshelf } from 'src/library/bookshelf/bookshelf.entity';
import { Genre } from 'src/library/category/category.entity';
import { Shelf } from 'src/library/shelf/shelf.entity';
import { Tag } from 'src/library/tag/tag.entity';
import { Goal } from 'src/reading/goals/goals.entity';
import { Reading } from 'src/reading/readings/reading.entity';
import { MonthlyStatistics } from 'src/statistics/monthly/monthly.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @OneToMany(() => Genre, (genre) => genre.user)
  genres: Genre[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => Bookshelf, (bookshelf) => bookshelf.user)
  bookshelves: Bookshelf[];

  @OneToMany(() => Shelf, shelf => shelf.user)
  shelves: Shelf[];

  @OneToMany(() => Bookset, (bookset) => bookset.user)
  booksets: Bookset[];

  @OneToMany(() => Reading, (reading) => reading.user)
  readings: Reading[];

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => MonthlyStatistics, (stats) => stats.user)
  monthlyStatistics: MonthlyStatistics[];
}

// src/library/category/genre.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/account/user/user.entity';
import { BookGenre } from '../book-genre/book-genre.entity';

@Entity({ name: 'genre' })
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.genres, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => BookGenre, (bookGenre) => bookGenre.genre)
  bookGenres: BookGenre[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/account/user/user.entity';
import { Shelf } from '../shelf/shelf.entity';

@Entity({ name: 'bookshelf' })
export class Bookshelf {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookshelves, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Shelf, (shelf) => shelf.bookshelf)
  shelves: Shelf[];
}

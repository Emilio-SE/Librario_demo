import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

import { User } from 'src/account/user/user.entity';
import { BookTag } from '../book-tag/book-tag.entity';

@Entity({ name: 'tag' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.tags, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => BookTag, bookTag => bookTag.tag)
  bookTags: BookTag[];
}

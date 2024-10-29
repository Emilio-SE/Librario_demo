import { Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../book/book.entity';
import { Tag } from '../tag/tag.entity';

@Entity({ name: 'booktag' })
export class BookTag {
    @PrimaryColumn()
    bookId: number;

    @PrimaryColumn()
    tagId: number;

    @ManyToOne(() => Book, book => book.bookTags, { onDelete: 'CASCADE' })
    book: Book;

    @ManyToOne(() => Tag, tag => tag.bookTags, { onDelete: 'CASCADE' })
    tag: Tag;
}

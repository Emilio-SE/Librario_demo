import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/account/user/user.entity';
import { Format } from '../format/format.entity';
import { BookGenre } from '../book-genre/book-genre.entity';
import { ShelfBook } from '../shelf-book/shelf-book.entity';
import { BooksetBook } from '../bookset-book/bookset-book.entity';
import { BookTag } from '../book-tag/book-tag.entity';
import { Reading } from 'src/reading/readings/reading.entity';

@Entity({ name: 'book' })
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.books, { onDelete: 'CASCADE' })
    user: User;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255 })
    author: string;

    @Column({ length: 20, unique: true })
    isbn: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ length: 255, nullable: true })
    publisher: string;

    @Column({ length: 50, nullable: true })
    edition: string;

    @Column({ length: 50, nullable: true })
    language: string;

    @Column({ nullable: true })
    pages: number;

    @Column({ type: 'date', nullable: true })
    publicationDate: Date;

    @Column({ type: 'date', nullable: true })
    acquisitionDate: Date;

    @ManyToOne(() => Format, format => format.books, { onDelete: 'SET NULL', nullable: true })
    format: Format;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;

    @Column({ default: false })
    asExpense: boolean;

    @Column({ length: 255, nullable: true })
    coverUrl: string;

    @OneToMany(() => BookGenre, bookGenre => bookGenre.book)
    bookGenres: BookGenre[];

    @OneToMany(() => BookTag, bookTag => bookTag.book)
    bookTags: BookTag[];

    @OneToMany(() => ShelfBook, shelfBook => shelfBook.book)
    shelfBooks: ShelfBook[];

    @OneToMany(() => BooksetBook, booksetBook => booksetBook.book)
    booksetBooks: BooksetBook[];

    @OneToMany(() => Reading, reading => reading.book)
    readings: Reading[];
}

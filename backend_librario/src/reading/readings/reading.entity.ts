import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/account/user/user.entity';
import { Book } from 'src/library/book/book.entity';

@Entity({ name: 'reading' })
export class Reading {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.readings, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Book, book => book.readings, { onDelete: 'CASCADE' })
    book: Book;

    @Column()
    currentPage: number;

    @Column({ nullable: true })
    rate: string;

    @Column('text', { nullable: true })
    review: string;

    @Column({ type: 'date', nullable: true })
    startReadingDate: Date;

    @Column({ type: 'date', nullable: true })
    endReadingDate: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/account/user/user.entity';

@Entity({ name: 'goals' })
export class Goal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.goals, { onDelete: 'CASCADE' })
    user: User;

    @Column({ length: 100 })
    title: string;

    @Column({ type: 'date', nullable: true })
    initialDate: Date;

    @Column({ type: 'date', nullable: true })
    finalDate: Date;

    @Column({ nullable: true })
    quantity: number;

    @Column({ nullable: true })
    currentBooksRead: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    percentage: number;
}

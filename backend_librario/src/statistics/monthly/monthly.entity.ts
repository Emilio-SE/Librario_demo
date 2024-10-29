import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/account/user/user.entity';

@Entity('monthlystatistics')
export class MonthlyStatistics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.monthlyStatistics, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  year: number;

  @Column({
    type: 'enum',
    enum: [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ],
  })
  month: string;

  @Column({ default: 0 })
  booksRead: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  moneySpent: number;

  @Column({ default: 0 })
  totalBooksRead: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  totalMoneySpent: number;
}

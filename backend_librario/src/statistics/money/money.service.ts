import { Injectable } from '@nestjs/common';
import { Book } from 'src/library/book/book.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class MoneyService {

    constructor(private readonly entityManager: EntityManager) {}

    async getMonthlyExpenses(userId: number): Promise<any> {
      const currentYear = new Date().getFullYear();
  
      const expenses = await this.entityManager
        .createQueryBuilder(Book, 'book')
        .select('EXTRACT(MONTH FROM book.acquisitionDate) AS month')
        .addSelect('SUM(book.price) AS totalSpent')
        .where('book.userId = :userId', { userId })
        .andWhere('book.asExpense = true')
        .andWhere('EXTRACT(YEAR FROM book.acquisitionDate) = :year', { year: currentYear })
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany();
  
      const monthlyExpenses = Array.from({ length: 12 }, (_, index) => {
        const monthData = expenses.find((e) => e.month === index + 1);
        return {
          month: index + 1,
          totalSpent: monthData ? Number(monthData.totalSpent) : 0,
        };
      });
  
      return monthlyExpenses;
    }

}

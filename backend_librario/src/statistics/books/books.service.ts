import { Injectable } from '@nestjs/common';
import { Reading } from 'src/reading/readings/reading.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(private readonly entityManager: EntityManager) {}

    async getReadBooksByMonth(userId: number): Promise<any> {
      const currentYear = new Date().getFullYear();
  
      const readings = await this.entityManager
        .createQueryBuilder(Reading, 'reading')
        .select('EXTRACT(MONTH FROM reading.endReadingDate) AS month')
        .addSelect('COUNT(*) AS count')
        .where('reading.userId = :userId', { userId })
        .andWhere('reading.endReadingDate IS NOT NULL')
        .andWhere('EXTRACT(YEAR FROM reading.endReadingDate) = :year', {
          year: currentYear,
        })
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany();
  
      const monthlyCounts = Array.from({ length: 12 }, (_, index) => {
        const monthData = readings.find((r) => r.month === index + 1);
        return {
          month: index + 1,
          count: monthData ? Number(monthData.count) : 0,
        };
      });
  
      return monthlyCounts;
    }
}

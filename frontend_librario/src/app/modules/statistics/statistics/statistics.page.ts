import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BooksStatisticsComponent } from '../segments/books-statistics/books-statistics.component';
import { FinanceStatisticsComponent } from '../segments/finance-statistics/finance-statistics.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPage implements OnInit {
  selectedSegment = 'books' as 'books' | 'expenses';

  constructor() {}

  ngOnInit() {}
}

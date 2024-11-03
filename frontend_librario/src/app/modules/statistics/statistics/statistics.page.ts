import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPage implements OnInit {
  selectedSegment = 'books' as 'books' | 'expenses';

  public contentMap = {
    books: 'books',
    expenses: 'expenses',
  };

  constructor() {}

  ngOnInit() {}
}

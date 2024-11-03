import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-readings',
  templateUrl: './Readings.page.html',
  styleUrls: ['./Readings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingsPage implements OnInit {
  selectedSegment = 'reading' as 'reading' | 'goal';

  public contentMap = {
    reading: 'reading',
    goal: 'goal',
  };

  constructor() {}

  ngOnInit() {}
}

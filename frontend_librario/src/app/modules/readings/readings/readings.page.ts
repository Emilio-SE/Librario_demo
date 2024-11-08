import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReadingComponent } from '../segments/readings/reading.component';
import { GoalComponent } from '../segments/goals/goal.component';
import { ReadingsSubmenuCommunicationService } from '../models/services/readingsSubmenuCommunication.service';

@Component({
  selector: 'app-readings',
  templateUrl: './Readings.page.html',
  styleUrls: ['./Readings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingsPage implements OnInit {

  private _commSvc = inject(ReadingsSubmenuCommunicationService);

  selectedSegment = 'reading' as 'reading' | 'goal';

  public contentMap = {
    reading: ReadingComponent,
    goal: GoalComponent,
  };

  constructor() {}

  ngOnInit() {}

  public openSubmenu(): void {
    this._commSvc.openSubmenu();
  }
}

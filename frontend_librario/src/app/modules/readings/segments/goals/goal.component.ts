import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

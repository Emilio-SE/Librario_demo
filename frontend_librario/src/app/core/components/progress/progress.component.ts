import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent implements OnInit {

  @Input() title: string = '';
  @Input() coverUrl: string = '';
  @Input() author: string = '';
  @Input() initDate: string = '';
  @Input() endDate: string = '';
  @Input() currentValue: number = 0;
  @Input() goalValue: number = 100;
  @Input() percentage: number = 0;
  @Input() type = 'book' as 'book' | 'goal';
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.percentage = parseFloat(this.percentage.toFixed(2));
  }

  public onClickSelect(): void {
      this.onClick.emit();
  }

}

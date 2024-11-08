import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonCheckbox,
  IonProgressBar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-book-preview',
  templateUrl: './book-preview.component.html',
  styleUrls: ['./book-preview.component.css'],
  standalone: true,
  imports: [
    IonProgressBar,
    IonCheckbox,
    IonIcon,
    IonButton,
    CommonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPreviewComponent implements OnInit {
  @Input() title: string = '';
  @Input() author: string = '';
  @Input() coverUrl: string = '';
  @Input() type = 'preview' as 'preview' | 'select' | 'delete' | 'progress';
  @Input() currentValue: number = 0;
  @Input() control: FormControl = new FormControl();
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  public onClickDelete(): void {
    if (this.type === 'delete') {
      this.onClick.emit();
    }
  }

  public onClickSelect(): void {
    if (this.type === 'preview') {
      this.onClick.emit();
    }
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-book-preview',
  templateUrl: './book-preview.component.html',
  styleUrls: ['./book-preview.component.css'],
  standalone: true,
  imports: [IonIcon, IonButton, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPreviewComponent implements OnInit {

  @Input() title: string = '';
  @Input() author: string = '';
  @Input() coverUrl: string = '';
  @Input() type = 'preview' as 'preview' | 'select' | 'delete';
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

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OtherComponent } from '../segments/others/other.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryPage implements OnInit {
  selectedSegment = 'other' as 'other';

  public contentMap = {
    //library: 'Library',
    //bookshelf: 'Bookshelf',
    //bookset: 'Bookset',
    other: OtherComponent,
  };

  constructor() {}

  ngOnInit() {}
}

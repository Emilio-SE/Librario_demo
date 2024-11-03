import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryPage implements OnInit {
  selectedSegment = 'library' as 'library' | 'bookshelf' | 'bookset' | 'other';

  public contentMap = {
    library: 'Library',
    bookshelf: 'Bookshelf',
    bookset: 'Bookset',
    other: 'Other',
  };

  constructor() {}

  ngOnInit() {}
}

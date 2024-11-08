import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { OtherComponent } from '../segments/others/other.component';
import { BooksComponent } from '../segments/books/books/books.component';
import { LibrarySubmenuCommunicationService } from '../modals/services/library-submenu-communication.service';
import { BooksetsComponent } from '../segments/booksets/booksets.component';
import { BookshelfComponent } from '../segments/bookshelves/bookshelf.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryPage implements OnInit {
  selectedSegment = 'library' as 'library' | 'bookshelf' | 'bookset' | 'other';

  private _submenuCommSvc = inject(LibrarySubmenuCommunicationService);

  public contentMap = {
    library: BooksComponent,
    bookshelf: BookshelfComponent,
    bookset: BooksetsComponent,
    other: OtherComponent,
  };

  constructor() {}

  ngOnInit() {}

  public openSubmenu(): void {
    if (this.selectedSegment === 'library') {
      this._submenuCommSvc.openBookSubmenu();
    } else if (this.selectedSegment === 'bookshelf') {
      this._submenuCommSvc.openBookSubmenu();
    }else if (this.selectedSegment === 'bookset') {
      this._submenuCommSvc.openBookSubmenu();
    }else if (this.selectedSegment === 'other') {
      this._submenuCommSvc.openBookSubmenu();
    }
  }
}

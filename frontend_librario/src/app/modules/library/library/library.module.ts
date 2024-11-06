import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibraryPage } from './library.page';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//components
import { ItemComponent } from 'src/app/core/components/item/item.component';
import { BookPreviewComponent } from 'src/app/core/components/book/book-preview.component';

//segments from library
import { OtherComponent } from '../segments/others/other.component';
import { CategoryListPage } from '../segments/others/category-list/category-list.page';
import { TagListPage } from '../segments/others/tag-list/tag-list.page';

import { BooksComponent } from '../segments/books/books/books.component';
import { FillBookPage } from '../segments/books/fill-book/fill-book.page';
import { BookDetailsPage } from '../segments/books/book-details/book-details.page';

//services for library
import { BooksService } from '../modals/services/books.service';
import { OtherService } from '../modals/services/other.service';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    ItemComponent,
    BookPreviewComponent,
    ReactiveFormsModule,
  ],
  declarations: [
    LibraryPage,
    BooksComponent,
    OtherComponent,
    CategoryListPage,
    TagListPage,
    FillBookPage,
    BookDetailsPage,
  ],
  exports: [RouterModule],
  providers: [OtherService, BooksService],
})
export class LibraryPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibraryPage } from './library.page';
import { RouterModule, Routes } from '@angular/router';

import { ItemComponent } from 'src/app/core/components/item/item.component';

import { OtherComponent } from '../segments/others/other.component';
import { CategoryListPage } from '../segments/others/category-list/category-list.page';
import { TagListPage } from '../segments/others/tag-list/tag-list.page';

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
  ],
  declarations: [LibraryPage, OtherComponent, CategoryListPage, TagListPage],
  exports: [RouterModule],
  providers: [OtherService],
})
export class LibraryPageModule {}

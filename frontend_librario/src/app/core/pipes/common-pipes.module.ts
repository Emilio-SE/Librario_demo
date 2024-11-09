import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBookListPipe } from 'src/app/modules/library/modals/pipes/filter-book-list.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FilterBookListPipe],
  exports: [FilterBookListPipe]
})
export class CommonPipesModule { }

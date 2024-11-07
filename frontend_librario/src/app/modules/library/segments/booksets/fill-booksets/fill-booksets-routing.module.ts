import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FillBooksetsPage } from './fill-booksets.page';

const routes: Routes = [
  {
    path: '',
    component: FillBooksetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FillBooksetsPageRoutingModule {}

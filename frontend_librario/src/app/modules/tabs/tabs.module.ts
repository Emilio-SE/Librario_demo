import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'library',
        loadChildren: () =>
          import('../library/books/components/books/books.module').then((m) => m.BooksPageModule),
      },
      {
        path: 'readings',
        loadChildren: () => import('../readings/goals/components/goals/goals.module').then( m => m.GoalsPageModule)
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then((m) => m.AccountModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}

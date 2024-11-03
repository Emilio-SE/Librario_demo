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
          import('../library/library/library.module').then(
            (m) => m.LibraryPageModule
          ),
      },
      {
        path: 'readings',
        loadChildren: () =>
          import('../readings/readings/readings.module').then(
            (m) => m.ReadingsPageModule
          ),
      },
      {
        path: 'statistics',
        loadChildren: () =>
          import('../statistics/statistics/statistics.module').then(
            (m) => m.StatisticsPageModule
          ),
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule, Routes } from '@angular/router';
import { StatisticsPage } from './statistics.page';

import { BooksStatisticsComponent } from '../segments/books-statistics/books-statistics.component';
import { FinanceStatisticsComponent } from '../segments/finance-statistics/finance-statistics.component';

import { StatisticsService } from '../models/services/statistics.service';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    StatisticsPage,
    BooksStatisticsComponent,
    FinanceStatisticsComponent,
  ],
  exports: [RouterModule],
  providers: [StatisticsService],
})
export class StatisticsPageModule {}

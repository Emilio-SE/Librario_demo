import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule, Routes } from '@angular/router';
import { ReadingsPage } from './readings.page';

import { ReadingComponent } from '../segments/readings/reading.component';

import { GoalComponent } from '../segments/goals/goal.component';
import { ReadingsSubmenuCommunicationService } from '../models/services/readingsSubmenuCommunication.service';

import { ItemComponent } from 'src/app/core/components/item/item.component';
import { ProgressComponent } from 'src/app/core/components/progress/progress.component';
import { BookPreviewComponent } from 'src/app/core/components/book/book-preview.component';

import { ReadingsService } from '../models/services/readings.service';
import { BookSelectionPage } from '../segments/readings/book-selection/book-selection.page';
import { FillReadingPage } from '../segments/readings/fill-reading/fill-reading.page';
import { UpdateReadingPage } from '../segments/readings/update-reading/update-reading.page';
import { CommonPipesModule } from 'src/app/core/pipes/common-pipes.module';

import { BooksService } from '../../library/modals/services/books.service';
import { GaolService } from '../models/services/gaol.service.service';

import { ManageGoalsPage } from '../segments/goals/manage-goals/manage-goals.page';

const routes: Routes = [
  {
    path: '',
    component: ReadingsPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ItemComponent,
    ProgressComponent,
    BookPreviewComponent,
    CommonPipesModule,
  ],
  declarations: [
    ReadingsPage,
    ReadingComponent,
    GoalComponent,
    BookSelectionPage,
    FillReadingPage,
    UpdateReadingPage,
    ManageGoalsPage,
  ],
  exports: [RouterModule],
  providers: [
    ReadingsSubmenuCommunicationService,
    ReadingsService,
    BooksService,
    GaolService
  ],
})
export class ReadingsPageModule {}

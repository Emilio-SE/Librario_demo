import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FillBooksetsPageRoutingModule } from './fill-booksets-routing.module';

import { FillBooksetsPage } from './fill-booksets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FillBooksetsPageRoutingModule
  ],
  declarations: [FillBooksetsPage]
})
export class FillBooksetsPageModule {}

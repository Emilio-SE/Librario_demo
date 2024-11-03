import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule, Routes } from '@angular/router';
import { ProfilePage } from './profile/profile.page';
import { AccountService } from './services/account.service';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ProfilePage],
  exports: [RouterModule],
  providers: [AccountService],
})
export class AccountModule {}

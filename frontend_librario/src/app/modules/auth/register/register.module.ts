import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { RouterModule, Routes } from '@angular/router';
import { LoginService } from '../models/services/auth.service';
import { FormErrorComponent } from 'src/app/core/components/formError/formError.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormErrorComponent
  ],
  declarations: [RegisterPage],
  exports: [RouterModule],
  providers: [
    LoginService
  ],
})
export class RegisterPageModule {}
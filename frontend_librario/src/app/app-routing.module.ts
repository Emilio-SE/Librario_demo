import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/guard.guard';
import { AuthService } from './core/services/auth.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'registrar',
    loadChildren: () =>
      import('./modules/auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./modules/tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  /*{
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },*/
  {
    path: 'register',
    loadChildren: () =>
      import('./modules/auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [AuthService],
})
export class AppRoutingModule {}

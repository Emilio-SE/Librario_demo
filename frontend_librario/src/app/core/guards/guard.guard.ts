import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Routes } from '../const/routes.const';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (
    route.routeConfig?.path == 'login' ||
    route.routeConfig?.path == 'registrar'
  ) {
    return checkLogin();
  } else {
    return checkPrmissions(route);
  }

  function checkPrmissions(route: ActivatedRouteSnapshot): boolean {
    if (authService.isTokenExpired()) {
      authService.logout();
      return false;
    }

    return true;
  }

  function checkLogin(): boolean {
    const isExpired = authService.isTokenExpired();
    console.log(isExpired);
    if (isExpired) return true;

    router.navigate([Routes.REDIRECT_AFTER_LOGIN]);

    return false;
  }
};

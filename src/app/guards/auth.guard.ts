import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AppService } from '../services/app.service';


export const authGuard: CanActivateFn = route => {
  const appService = inject(AppService);
  const router = inject(Router);

  if (appService.userDetails().role === 'supervisor'
    || appService.userDetails().role === 'admin') {
    return true;
  }

  router.navigateByUrl('/');
  return false;
}
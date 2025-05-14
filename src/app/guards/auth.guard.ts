import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AppService } from '../services/app.service';


export const authGuard: CanActivateFn = route => {
  const appService = inject(AppService);
  const router = inject(Router);
  const role = appService.userDetails().role;

  if (role === 'supervisor' || role === 'admin') {
    return true;
  } else {
    router.navigateByUrl('/');
    return false;
  }

}
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppService } from '../services/app.service';


export const authGuard: CanActivateFn = route => {
  const appService = inject(AppService);
  const router = inject(Router);
  const role = appService.userDetails().role;

  if (role === 'supervisor' || role === 'admin'|| role === 'webmaster') {
    return true;
  } else {
    router.navigateByUrl('/');
    return false;
  }

}
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AppService } from '../services/app.service';

export const questionsGuard: CanActivateFn = route => {
  const appService = inject(AppService);
  const router = inject(Router);
    
  if(appService.quizId() === undefined){
    router.navigateByUrl('/');
    return false;
  }
  
  return true;
};
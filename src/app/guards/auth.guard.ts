import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { AppService } from '../services/app.service';

export class AuthGuard implements CanActivate {
  private readonly appService = inject(AppService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.appService.userDetails().role === 'supervisor'
        || this.appService.userDetails().role === 'admin'
  }

}


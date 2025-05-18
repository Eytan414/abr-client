import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Injectable({ providedIn: 'root' })
export class GaTrackingService {
  constructor(router: Router) {
    router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    )
      .subscribe(event => {
        gtag('config', 'G-2BS6QCKNR4', {
          page_path: event.urlAfterRedirects,
        });
      });
  }
}

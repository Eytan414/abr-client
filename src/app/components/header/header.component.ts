import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  apiUrl = environment.apiUrl;
  logoLoaded = signal<boolean>(false);
  readonly preloadedLogoUrl$: Observable<string> = new Observable(observer => {
    const img = new Image();
    img.onload = () => {
      observer.next(this.apiUrl + 'webp-image/logo');
      observer.complete();
      this.logoLoaded.set(true);
    };
    img.src = this.apiUrl + 'webp-image/logo';
  });
}
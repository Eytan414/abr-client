import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  bgUrl = `${environment.apiUrl}webp-image/bg`;
  bgLoaded = signal<boolean>(false);

  readonly preloadedBackgroundUrl$: Observable<string> = new Observable(observer => {
    const img = new Image();
    img.onload = () => {
      observer.next(this.bgUrl);
      observer.complete();
      this.bgLoaded.set(true);
    };
    img.src = this.bgUrl;
  });


}

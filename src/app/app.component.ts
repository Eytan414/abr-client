import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'tomer';

  getBgString() {
    return `url(${environment.apiUrl}webp-image/bg)`
  }
}

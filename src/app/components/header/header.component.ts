import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  apiUrl = environment.apiUrl;

}
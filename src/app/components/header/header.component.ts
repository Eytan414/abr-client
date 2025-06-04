import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  logoUrl = `${environment.apiUrl}webp-image/logo`;
  whatsappUrl = `${environment.apiUrl}webp-image/whatsapp`;  
}
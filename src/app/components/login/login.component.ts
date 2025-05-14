import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'login',
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly backend = inject(BackendService);
  password = '';

  onSubmit() {
    this.backend.login(this.password).subscribe();
  }
}

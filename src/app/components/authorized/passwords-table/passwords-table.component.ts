import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DashboardService, TablePassword } from '../../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../../../services/backend.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'passwords-table',
  imports: [
    MatTableModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './passwords-table.component.html',
  styleUrl: './passwords-table.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordsTableComponent {
  private readonly backend = inject(BackendService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly appService = inject(AppService);

  protected editCell(element: TablePassword) {
    element.isEditing = true;
  }

  protected saveCell(element: TablePassword) {
    element.isEditing = false;
    this.backend.updatePassword(element.id, element.password).subscribe();
  }

  protected retrievePasswords() {
    this.backend.loadPasswords().subscribe();

    const user = this.appService.userDetails();
    const message = JSON.stringify(user);
    this.backend.saveLog('info', message, 'retrieve_passwords').subscribe();

  }
}

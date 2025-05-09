import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DashboardService, TablePassword } from '../../../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../../../../services/backend.service';

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
  readonly dashboardService = inject(DashboardService);

  editCell(element: TablePassword) {
    element.isEditing = true;
  }
  saveCell(element: TablePassword) {
    element.isEditing = false;
    this.backend.updatePassword(element.id, element.password).subscribe();
  }
  passmepass() {
    this.backend.passmepass().subscribe();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DashboardService, TablePassword } from '../../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../../../services/backend.service';
import { GaTrackingService } from '../../../services/ga-tracking.service';
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
  readonly dashboardService = inject(DashboardService);
  private readonly tracking = inject(GaTrackingService);
  readonly appService = inject(AppService);

  editCell(element: TablePassword) {
    element.isEditing = true;
  }
  saveCell(element: TablePassword) {
    element.isEditing = false;
    this.backend.updatePassword(element.id, element.password).subscribe();
  }
  passmepass() {
    this.tracking.sendEvent(this.appService.userDetails().role + ' accessed manage'
    this.backend.passmepass().subscribe();
  }
}

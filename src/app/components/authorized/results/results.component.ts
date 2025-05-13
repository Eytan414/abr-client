import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { DashboardService } from '../../../services/dashboard.service';
import { MatTableModule } from '@angular/material/table';
import { ScoresTableComponent } from "./scores-table/scores-table.component";
import { PasswordsTableComponent } from "./passwords-table/passwords-table.component";
import { MatDialog } from '@angular/material/dialog';
import { AddSchoolComponent } from '../add-school/add-school.component';

@Component({
  selector: 'app-results',
  imports: [
    FormsModule,
    MatTableModule,
    ScoresTableComponent,
    PasswordsTableComponent,
    AddSchoolComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent {


  /* unidentified() {
    this.dashboardService.role.set('unidentified');
  }
  adminRole() {
    this.dashboardService.role.set('admin');
  }
  superRole() {
    this.dashboardService.role.set('super');
  } */
  private readonly backend = inject(BackendService);
  private readonly dialog = inject(MatDialog);
  readonly dashboardService = inject(DashboardService);

  password = '';
  isAuthenticated = computed(() => this.dashboardService.role() !== 'unidentified');

  onSubmit() {
    this.backend.login(this.password).subscribe();
  }

}

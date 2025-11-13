import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { BackendService } from '../../../services/backend.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { DashboardService } from '../../../services/dashboard.service';
import { ScoresTableComponent } from '../scores-table/scores-table.component';
import { AddSchoolComponent } from '../add-school/add-school.component';
import { EditSchoolComponent } from '../edit-school/edit-school.component';
import { PasswordsTableComponent } from '../passwords-table/passwords-table.component';
import { LogsComponent } from '../logs/logs.component';

@Component({
  selector: 'manage',
  imports: [
    FormsModule,
    ScoresTableComponent,
    AddSchoolComponent,
    LogsComponent,
    PasswordsTableComponent,
    EditSchoolComponent
  ],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageComponent implements OnInit {
  protected readonly appService = inject(AppService);
  protected readonly backend = inject(BackendService);
  protected readonly dashboardService = inject(DashboardService);
  
  protected readonly selectedSchool = signal<string>('');
  protected readonly currentSchoolSupervisors = computed(() =>
    this.dashboardService.schoolsDataAdmin()
      .filter(school => this.selectedSchool() === school.id)
      .map(school => school.supervisors));
  @ViewChild('selectSchool') selectSchool!: ElementRef<HTMLSelectElement>;

  constructor() {
    effect(() => {
      const schoolId = this.selectedSchool();
      if (this.appService.userDetails().role === 'supervisor' || schoolId === '' ) return;
      
      this.fetchScoresTable(schoolId);
    });

  }

  ngOnInit() {
    const message = JSON.stringify(this.appService.userDetails());
    this.backend.saveLog('info', message, 'accessed manage').subscribe();

    const user = this.appService.userDetails();
    if (!user.schoolId || user.role === 'admin') return;
    
    this.fetchScoresTable(user.schoolId);
  }
  
  private fetchScoresTable(schoolId: string) {
    this.dashboardService.scoresTableLoading.set(true);
    this.backend.fetchResultsBySchool(schoolId).pipe(
      tap(scores => this.dashboardService.scoresData.set(scores)),
      catchError(err => {
        console.error(err);
        this.backend.saveLog('error', JSON.stringify(err), 'super fetch scores').subscribe();
        return EMPTY;
      }),
      finalize(() => this.dashboardService.scoresTableLoading.set(false))
    ).subscribe();
  }
}

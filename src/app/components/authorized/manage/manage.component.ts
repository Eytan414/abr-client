import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnInit, signal, Type, ViewChild } from '@angular/core';
// import { NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { BackendService } from '../../../services/backend.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { DashboardService } from '../../../services/dashboard.service';
import { GaTrackingService } from '../../../services/ga-tracking.service';
import { ScoresTableComponent } from '../scores-table/scores-table.component';
import { AddSchoolComponent } from '../add-school/add-school.component';
import { PasswordsTableComponent } from '../passwords-table/passwords-table.component';

@Component({
  selector: 'manage',
  imports: [
    FormsModule,
    // NgComponentOutlet,
    ScoresTableComponent,
    AddSchoolComponent,
    PasswordsTableComponent
  ],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageComponent implements OnInit {

  // scoresComponent = this.injectComponent(() => import('../scores-table/scores-table.component').then(m => m.ScoresTableComponent));
  // passwordsComponent = this.injectComponent(() => import('../passwords-table/passwords-table.component').then(m => m.PasswordsTableComponent));
  // addSchoolComponent = this.injectComponent(() => import('../add-school/add-school.component').then(m => m.AddSchoolComponent));
  private readonly tracking = inject(GaTrackingService);
  readonly appService = inject(AppService);
  readonly backend = inject(BackendService);
  readonly dashboardService = inject(DashboardService);
  selectedSchool = signal<string>('');
  currentSchoolSupervisors = computed(() =>
    this.dashboardService.scoresDataAdmin()
      .filter(school => this.selectedSchool() === school.id)
      .map(school => school.supervisors));
  @ViewChild('selectSchool') selectSchool!: ElementRef<HTMLSelectElement>;

  constructor() {
    effect(() => {
      const schoolId = this.selectedSchool();
      if (this.appService.userDetails().role !== 'admin' || schoolId === '') return;

      this.dashboardService.scoresTableLoading.set(true);

      this.backend.fetchResultsBySchool(schoolId).pipe(
        tap(this.dashboardService.scoresData.set),
        catchError(err => {
          console.error(err);
          this.dashboardService.scoresTableLoading.set(false);
          return EMPTY;
        }),
        finalize(() => this.dashboardService.scoresTableLoading.set(false))
      ).subscribe();
    });

  }

  ngOnInit() {
    const user = this.appService.userDetails();
    this.handleAnalytics(user.role);
    if (user.role !== 'supervisor') return;

    this.dashboardService.scoresTableLoading.set(true);

    this.backend.fetchResultsBySchool(user.schoolId!).pipe(
      tap(scores => this.dashboardService.scoresData.set(scores)),
      catchError(err => {
        console.error(err);
        return EMPTY;
      }),
      finalize(() => this.dashboardService.scoresTableLoading.set(false))
    ).subscribe();

  }
  handleAnalytics(role: string | undefined) {
    const accessedManageDate = new Date().toLocaleDateString('en-GB') + " | " + new Date().toLocaleTimeString('en-GB')
    this.tracking.sendEvent('manage_access', { accessedManageDate, role });
    
  }


  // injectComponent<T>(loader: () => Promise<Type<T>>) {
  //   const comp = signal<Type<T> | null>(null);
  //   loader().then(comp.set);
  //   return comp;
  // }

}

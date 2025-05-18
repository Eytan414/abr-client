import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnInit, signal, Type, ViewChild } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { BackendService } from '../../../services/backend.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { GaTrackingService } from '../../../services/ga-tracking.service';

@Component({
  selector: 'manage',
  imports: [
    FormsModule,
    NgComponentOutlet
  ],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageComponent implements OnInit {
  scoresComponent = this.injectComponent(() => import('../scores-table/scores-table.component').then(m => m.ScoresTableComponent));
  passwordsComponent = this.injectComponent(() => import('../passwords-table/passwords-table.component').then(m => m.PasswordsTableComponent));
  addSchoolComponent = this.injectComponent(() => import('../add-school/add-school.component').then(m => m.AddSchoolComponent));
  private readonly tracking = inject(GaTrackingService);
  readonly appService = inject(AppService);
  readonly backend = inject(BackendService);
  readonly dashboardService = inject(DashboardService);
  selectedSchool = signal<string>('');

  @ViewChild('selectSchool') selectSchool!: ElementRef<HTMLSelectElement>;

  constructor() {
    effect(() => {
      if (this.appService.userDetails().role !== 'admin' || this.selectedSchool() === '') return;

      this.dashboardService.scoresTableLoading.set(true);

      this.backend.fetchResultsBySchool(this.selectedSchool()).pipe(
        tap(scores => this.appService.scoresData.set(scores)),
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
    this.tracking.sendEvent(this.appService.userDetails().role + ' accessed manage');
    const user = this.appService.userDetails();
    if (user.role !== 'supervisor') return;

    this.dashboardService.scoresTableLoading.set(true);

    this.backend.fetchResultsBySchool(user.schoolId!).pipe(
      tap(scores => this.appService.scoresData.set(scores)),
      catchError(err => {
        console.error(err);
        return EMPTY;
      }),
      finalize(() => this.dashboardService.scoresTableLoading.set(false))
    ).subscribe();

  }


  injectComponent<T>(loader: () => Promise<Type<T>>) {
    const comp = signal<Type<T> | null>(null);
    loader().then(comp.set);
    return comp;
  }

}

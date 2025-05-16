import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, Type, ViewChild } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { BackendService } from '../../../services/backend.service';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { ScoresData } from '../../../shared/models/types';
import { DashboardService } from '../../../services/dashboard.service';
import { EMPTY } from 'rxjs/internal/observable/empty';

@Component({
  selector: 'results',
  imports: [
    FormsModule,
    NgComponentOutlet
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent implements OnInit, AfterViewInit {
  scoresComponent = this.injectComponent(() => import('../scores-table/scores-table.component').then(m => m.ScoresTableComponent));
  passwordsComponent = this.injectComponent(() => import('../passwords-table/passwords-table.component').then(m => m.PasswordsTableComponent));
  addSchoolComponent = this.injectComponent(() => import('../add-school/add-school.component').then(m => m.AddSchoolComponent));
  readonly appService = inject(AppService);
  readonly backend = inject(BackendService);
  readonly dashboardService = inject(DashboardService);
  selectedSchool = signal<string>('');

  @ViewChild('selectSchool') selectSchool!: ElementRef<HTMLSelectElement>;


  ngOnInit() {
    if (this.appService.userDetails().role !== 'supervisor') return;
    this.backend.fetchResultsBySchool(this.appService.userDetails().schoolId!).pipe(
      map((scoresResp: ScoresData) => {
        this.appService.scoresData.set(scoresResp);
      }))
  }

  ngAfterViewInit() {
    if (this.appService.userDetails().role !== 'admin') return;

    fromEvent(this.selectSchool.nativeElement, 'change').pipe(
      map(e => (e.target as HTMLSelectElement).value),
      filter(value => value !== ''),
      tap(() => this.dashboardService.scoresTableLoading.set(true)),
      switchMap(schoolId => this.backend.fetchResultsBySchool(schoolId).pipe(
        tap(scoresResp => this.appService.scoresData.set(scoresResp)),
        catchError(err => {
          console.error(err);
          this.dashboardService.scoresTableLoading.set(false);
          return EMPTY;
        }),
      )),
    ).subscribe();

  }

  injectComponent<T>(loader: () => Promise<Type<T>>) {
    const comp = signal<Type<T> | null>(null);
    loader().then(comp.set);
    return comp;
  }

}

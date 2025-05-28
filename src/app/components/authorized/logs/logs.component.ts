import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DashboardService } from '../../../services/dashboard.service';
import { ParseJsonOrStringPipe } from '../../../pipes/parse-json-or-string.pipe';
import { DatePipe, JsonPipe } from '@angular/common';
import { BackendService } from '../../../services/backend.service';
import { finalize, tap } from 'rxjs';
import { Log } from '../../../shared/models/types';
import { LogMessageComponent } from './log-message/log-message.component';

@Component({
  selector: 'logs',
  imports: [
    MatTableModule,
    MatSortModule,
    MatSort,
    ParseJsonOrStringPipe,
    DatePipe,
    LogMessageComponent,
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent implements OnInit {
  private readonly backend = inject(BackendService);
  readonly dashboardService = inject(DashboardService);

  dataSource = new MatTableDataSource<Log>();
  refresh = signal<boolean>(false);

  constructor() {
    //TODO: finish impl for refresh

    /* effect(() => {
      this.dataSource.data = this.dashboardService.logs();

      const refresh = this.refresh();
      this.backend.getLogs().pipe(
        tap(this.dashboardService.logs.set),
        finalize(() => this.refresh.set(true))
      ).subscribe();
    }); */
  }

  ngOnInit(): void {
    this.dataSource.data = this.dashboardService.logs();
    this.backend.getLogs().pipe(
      tap(this.dashboardService.logs.set),
    ).subscribe();
  }

  refreshData() {

  }
}

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DashboardService } from '../../../services/dashboard.service';
import { ParseJsonOrStringPipe } from '../../../pipes/parse-json-or-string.pipe';
import { DatePipe } from '@angular/common';
import { BackendService } from '../../../services/backend.service';
import { finalize, tap } from 'rxjs';
import { Log } from '../../../shared/models/types';
import { LogMessageComponent } from './log-message/log-message.component';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'logs',
  imports: [
    MatTableModule,
    MatSortModule,
    ParseJsonOrStringPipe,
    DatePipe,
    LogMessageComponent,
    MatIcon,
    MatPaginatorModule,
    MatProgressSpinnerModule
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
  pagedData = computed(() => {
    const data = this.dashboardService.logs();
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  confirmDeleteRow = signal<string | null>(null);
  pageSize = signal(10);
  pageIndex = signal(0);
  refresh = signal<boolean>(false);
  loading = computed(() => this.refresh())
  
  constructor() {
    effect(() => {
      if (!this.refresh()) return;

      this.backend.getLogs().pipe(
        tap(this.dashboardService.logs.set),
        finalize(() => this.refresh.set(false))
      ).subscribe();
    });


  }

  ngOnInit(): void {
    this.dataSource.data = this.dashboardService.logs();
    this.backend.getLogs().pipe(
      tap(this.dashboardService.logs.set),
    ).subscribe();
  }

  refreshData() {
    this.refresh.set(true);
  }

  deleteRow(rowId: string) {
    this.backend.deleteLogRecord(rowId).subscribe();
    this.dashboardService.logs.update(logs => logs.filter((log: Log) => log._id !== rowId));
    this.confirmDeleteRow.set(null)
  }
  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}

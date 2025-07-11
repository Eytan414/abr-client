import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DashboardService } from '../../../services/dashboard.service';
import { Jsonify } from '../../../pipes/jsonify.pipe';
import { SchoolidToSchoolnamePipe } from '../../../pipes/schoolid-to-schoolname.pipe';
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
    Jsonify,
    DatePipe,
    LogMessageComponent,
    MatIcon,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SchoolidToSchoolnamePipe
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent implements OnInit {
  private readonly backend = inject(BackendService);
  protected readonly dashboardService = inject(DashboardService);

  protected dataSource = new MatTableDataSource<Log>();
  protected readonly pagedData = computed(() => {
    const data = this.dashboardService.logs();
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  protected readonly confirmDeleteRow = signal<string | null>(null);
  protected readonly pageSize = signal(10);
  protected readonly pageIndex = signal(0);
  protected readonly refresh = signal<boolean>(false);
  protected readonly loading = computed(() => this.refresh())

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

  protected refreshData() {
    this.refresh.set(true);
  }

  protected deleteRow(rowId: string) {
    this.backend.deleteLogRecord(rowId).subscribe();
    this.dashboardService.logs.update(logs => logs.filter((log: Log) => log._id !== rowId));
    this.confirmDeleteRow.set(null)
  }

  protected onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { ScoreRecord } from '../../../shared/models/types';
import { StudentSheetComponent } from '../student-sheet/student-sheet.component';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'scores-table',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    FormsModule,
    StudentSheetComponent,
    MatProgressSpinnerModule,

  ],
  templateUrl: './scores-table.component.html',
  styleUrl: './scores-table.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoresTableComponent {
  protected readonly dashboardService = inject(DashboardService);

  protected selectedDateFilter: string = '';
  protected selectedRow: ScoreRecord | null = null;
  protected showQuizForm: boolean = false;
  protected readonly recordCount = this.dashboardService.recordCount;
  protected readonly distinctDates = computed(() => this.dashboardService.scoresData().quizDistinctDates ?? []);
  protected dataSource = new MatTableDataSource<ScoreRecord>();
  private sort!: MatSort;

  @ViewChild(MatSort, { static: false })
  set matSort(ms: MatSort) {
    if (!ms) return;
    this.dataSource.sort = ms;
    this.dataSource.sortData = (data, sort) =>
      !sort.active || !sort.direction
        ? data
        : data.sort((a, b) =>
          this.compareByColumn(a, b, sort.active, sort.direction === 'asc')
        );
    this.dataSource.filterPredicate = (rec, filter) => rec.date === filter;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.dashboardService.scoresData().scoresBySchool;
      this.selectedDateFilter = '';
      this.dataSource.filter = '';
    });
  }

  protected rowClicked(row: any) {
    this.selectedRow = row;
    this.showQuizForm = true;
  }

  protected updateFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDateFilter = target.value;
    this.dataSource.filter = this.selectedDateFilter ?? '';
  }

  private compareByColumn(a: ScoreRecord, b: ScoreRecord, column: string, isAsc: boolean): number {
    let comparison = 0;
    switch (column) {
      case 'score':
        comparison = a.score - b.score;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'grade':
        if (!a.grade || !b.grade) return 0;
        comparison = a.grade.localeCompare(b.grade);
        break;
      default:
        comparison = 0;
    }
    return isAsc ? comparison : -comparison;
  }

}

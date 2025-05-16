import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
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
export class ScoresTableComponent implements AfterViewInit {
  readonly appService = inject(AppService);
  readonly dashboardService = inject(DashboardService);
  @ViewChild(MatSort) sort!: MatSort;

  selectedDate: string = '';
  selectedRow: ScoreRecord | null = null;
  showQuizForm: boolean = false;
  dataSource = new MatTableDataSource<ScoreRecord>();
  distinctDates = computed(() => this.appService.scoresData().quizDistinctDates ?? []);

  constructor() {
    effect(() => {
      this.dataSource.data = this.appService.scoresData().scoresBySchool;
    });
  }

  ngAfterViewInit() {
    this.setupDataTable();
  }
  
  setupDataTable() {
    this.dataSource.sortData = (data: ScoreRecord[], sort: MatSort) => {
      if (!sort.active || sort.direction === '') {
        return data;
      }
      return data.sort((a, b) => this.compareByColumn(a, b, sort.active, sort.direction === 'asc'));
    };
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (record, filter: string) => {
      return record.date === filter;
    };
  }

  rowClicked(row: any) {
    this.selectedRow = row;
    this.showQuizForm = true;
  }

  updateFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDate = target.value;
    this.dataSource.filter = this.selectedDate ?? '';
  }

  private compareByColumn(a: ScoreRecord, b: ScoreRecord, column: string, isAsc: boolean): number {
    let comparison = 0;
    switch (column) {
      case 'score':
        comparison = a.score - b.score;
        break;

      case 'name':
        comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        break;

      default:
        comparison = 0;
    }
    return isAsc ? comparison : -comparison;
  }

}

import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../../services/dashboard.service';
import { catchError } from 'rxjs/operators';
import { of, tap } from 'rxjs';

@Component({
  selector: 'student-sheet',
  imports: [
    MatTableModule,
  ],
  templateUrl: './student-sheet.component.html',
  styleUrl: './student-sheet.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentSheetComponent implements OnInit {
  private readonly backend = inject(BackendService);
  private readonly dashboardService = inject(DashboardService);

  studentPhone = input<string>('');

  studentTableData = signal<any>([]);
  displayedColumns = signal<string[]>([]);
  fullAnswerData!: any;

  ngOnInit(): void {
    this.backend.getScoresByPhone(this.studentPhone()).pipe(
      catchError(err => {
        console.error(err);
        return of([]);
      }),
      tap((data: any) => {
        const flatRow = Object.fromEntries(
          data.map((entry: any, i: number) => [(i + 1).toString(), entry.studentAnswer])
        );
        this.studentTableData.set([flatRow]);
        this.displayedColumns.set(Object.keys(flatRow));
        this.fullAnswerData = data;
      })
    ).subscribe();

  }

  debugger() {
    debugger;
  }

}

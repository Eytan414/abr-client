import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../../services/dashboard.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { PopoverDirective } from '@coreui/angular';
@Component({
  selector: 'student-sheet',
  imports: [
    MatTableModule,
    PopoverDirective,
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
  fullAnswerData!: SheetData[];
  popover = signal<PopoverData>({});
  showPopover = signal<boolean>(false);

  ngOnInit(): void {
    this.backend.getScoresByPhone(this.studentPhone()).pipe(
      catchError(err => {
        console.error(err);
        return of<SheetData[]>([]);
      }),
      tap((data: SheetData[]) => {
        const flatRow = Object.fromEntries(
          data.map((entry: any, i: number) => [(i + 1).toString()])
        );
        this.studentTableData.set([flatRow]);
        this.displayedColumns.set(Object.keys(flatRow));
        this.fullAnswerData = data;
      })
    ).subscribe();

  }
  showTextualQuestion(questionIndex: number, rowAnswerData: SheetData) {
    this.popover.update(p => {
      const isSame = p.questionIndex === questionIndex;
      return {
        ...p,
        questionText: rowAnswerData.question,
        questionIndex: isSame ? -1 : questionIndex,
        answerIndex: -1,
      }
    });
  }

  showTextualAnswer(answerIndex: number, rowAnswerData: SheetData) {
    this.popover.update(p => {
      const isSame = p.answerIndex === answerIndex;
      return {
        ...p,
        answerText: rowAnswerData.answerText,
        answerIndex: isSame ? -1 : answerIndex,
        questionIndex: -1,
      }
    });
  }

  styleAnswer(answerData: any): string {
    return answerData.isCorrect ? 'correct' : 'wrong';
  }


}
export type SheetData = {
  answer?: number;
  answerText?: string;
  correctAnswer?: { id: number, value: string };
  isCorrect?: boolean;
  question?: string;
}
type PopoverData = {
  questionText?: string;
  questionIndex?: number;
  answerText?: string;
  answerIndex?: number;
}
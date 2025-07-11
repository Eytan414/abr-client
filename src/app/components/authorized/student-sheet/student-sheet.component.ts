import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { StudentSheetPipe } from '../../../pipes/student-sheet.pipe';
import { MatTableModule } from '@angular/material/table';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { PopoverDirective } from '@coreui/angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'student-sheet',
  imports: [
    MatTableModule,
    PopoverDirective,
    MatProgressSpinnerModule,
    StudentSheetPipe,
  ],
  templateUrl: './student-sheet.component.html',
  styleUrl: './student-sheet.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentSheetComponent implements OnInit {
  private readonly backend = inject(BackendService);
  readonly studentPhone = input<string>('');

  protected readonly studentTableData = signal<unknown[]>([]);
  protected readonly displayedColumns = signal<string[]>([]);
  protected readonly popover = signal<PopoverData>({});
  protected readonly showPopover = signal<boolean>(false);
  protected fullAnswerData!: SheetData[];

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

  protected showTextualQuestion(questionIndex: number, rowAnswerData: SheetData) {
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

  protected showTextualAnswer(answerIndex: number, rowAnswerData: SheetData) {
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
  

}
export type SheetData = {
  answer?: number | string;
  answerText?: string;
  correctAnswer?: { id: number, value: string };
  style?: string;
  question?: string;
}
type PopoverData = {
  questionText?: string;
  questionIndex?: number;
  answerText?: string;
  answerIndex?: number;
}
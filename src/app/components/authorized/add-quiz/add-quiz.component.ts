import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { newQuiz, Quiz } from '../../../shared/models/quiz';
import { FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { catchError, concatMap, of, tap } from 'rxjs';
import { AlertComponent } from '@coreui/angular';
import { DashboardService } from '../../../services/dashboard.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'add-quiz',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddQuizComponent {
  backend = inject(BackendService);
  dashboardService = inject(DashboardService);

  protected newQuiz = signal<Quiz>(newQuiz);
  protected readonly submitionStatus = signal<number>(-1);
  protected readonly fileSubmitionStatus = signal<number[]>([]);
  private files = signal<Record<number, File | null>>({});

  protected readonly loading = signal<boolean>(false);


  addQuestion() {
    this.newQuiz.update(quiz => ({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          title: "",
          imageUrl: "",
          possible_answers: [
            { id: 1, value: "" },
            { id: 2, value: "" },
            { id: 3, value: "" },
            { id: 4, value: "" }
          ],
          weight: 1
        }
      ]
    }));

  }

  deleteQuestion(index: number) {
    this.newQuiz.update(q => ({
      ...q,
      questions: q.questions.filter((_, i) => i !== index)
    }));
  }

  form = new FormGroup({
    title: new FormControl(''),
    questions: new FormArray<FormGroup>([]),
  });


  onSubmit(addQuizForm: NgForm) {
    this.backend.createQuiz(this.newQuiz()).pipe(
      tap(() => {
        this.submitionStatus.set(200);
        this.newQuiz.update(quiz => ({ ...quiz, questions: [] }));
        addQuizForm.resetForm();
      }),
      concatMap(() => this.backend.getAllquizzes()
        .pipe(
          tap((quizzes: Quiz[]) => this.dashboardService.quizzes.set(quizzes))
        )
      ),
      catchError(err => {
        this.submitionStatus.set(err.status);
        return of(err);
      })
    ).subscribe();
  }

  triggerFileInput(index: number) {
    const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  checkMediaType(fileUrl: string | undefined) {
    if (!fileUrl) return;
    if (fileUrl.match(/\.(jpg|jpeg|png|gif)$/i)
      || fileUrl.match(/image/)) return 'image';
    if (fileUrl.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    return 'unknown';
  }

  removeFile(question: any, index?: number) {
    question.imageUrl = '';
    if (index === undefined) return;
    this.fileSubmitionStatus.update(arr => {
      const next = [...(arr ?? [])];
      while (next.length <= index) next.push(-1);
      next[index] = -1;
      return next;
    });
  }

  getFileStatus(index: number): number {
    const statuses = this.fileSubmitionStatus();
    return statuses[index] ?? -1;
  }
  hasFileForQuestion(index: number): boolean {
    return !!this.files()[index];
  }
  upload(index: number) {
    const file = this.files()[index];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    this.backend.uploadFile(fd).pipe(
      tap(resp => {
        this.newQuiz.update(quiz => ({
          ...quiz,
          questions: quiz.questions.map((question, i) =>
            i === index ? { ...question, imageUrl: resp.path } : question
          )
        }));

      }),
      tap(() => {
        this.fileSubmitionStatus.update(arr => {
          const next = [...(arr ?? [])];
          while (next.length <= index) next.push(-1);
          next[index] = 200;
          return next;
        });
      }),
      catchError(err => {
        this.fileSubmitionStatus.update(arr => {
          const next = [...(arr ?? [])];
          while (next.length <= index) next.push(-1);
          next[index] = err?.status ?? 500;
          return next;
        });
        return of(err);
      }
      )
    ).subscribe();

    this.files()[index] = null;
  }
  onFile(e: Event, index: number) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.files.update(f => ({ ...f, [index]: file }));
  }

}

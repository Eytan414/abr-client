import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { AlertComponent } from '@coreui/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BackendService } from '../../../services/backend.service';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Quiz } from '../../../shared/models/quiz';

@Component({
  selector: 'edit-quiz',
  imports: [
    FormsModule,
    AlertComponent,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-quiz.component.html',
  styleUrl: './edit-quiz.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditQuizComponent {
  protected readonly dashboardService = inject(DashboardService);
  protected readonly backend = inject(BackendService);

  protected readonly selectedQuiz = signal<number>(-1);
  protected readonly activeQuiz = computed(() =>
    this.dashboardService.quizzes().find(quiz => quiz.id == this.selectedQuiz())!
  );

  protected readonly submitionStatus = signal<number>(-1);
  protected readonly fileSubmitionStatus = signal<number>(-1);
  protected readonly loading = signal<boolean>(false);
  file: File | null = null;


  protected formData = computed(() => {
    return {
      title: this.activeQuiz()?.title,
      questions: this.activeQuiz()?.questions,
      answers: this.activeQuiz()?.answers,
    }
  });

  checkMediaType(fileUrl: string | undefined) {
    if (!fileUrl) return;
    if (fileUrl.match(/\.(jpg|jpeg|png|gif)$/i)
        || fileUrl.match(/image/)) return 'image';
    if(fileUrl.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    return 'unknown';
  }

  addQuestion() {
    this.formData().questions.push({
      title: "",
      imageUrl: "",
      possible_answers: [{ id: 1, value: "" }, { id: 2, value: "" }, { id: 3, value: "" }, { id: 4, value: "" }],
      weight: 1
    });
  }

  deleteQuestion(index: number) {
    this.formData().questions = this.formData().questions.filter((_, i) => i !== index);
  }

  deleteQuiz() {
    this.backend.deleteQuiz(this.selectedQuiz()).pipe(
      concatMap(() => this.backend.getAllquizzes()
        .pipe(
          tap((quizzes: Quiz[]) => this.dashboardService.quizzes.set(quizzes))
        )
      ),
    ).subscribe();
    this.selectedQuiz.set(-1);
  }

  upload(index: number) {
    if (!this.file) return;

    const fd = new FormData();
    fd.append('file', this.file);
    this.backend.uploadFile(fd).pipe(
      tap(resp => this.formData().questions[index].imageUrl = resp.path),
      tap(_ => this.fileSubmitionStatus.set(200)),
      catchError(err => {
        this.fileSubmitionStatus.set(err.status);
        return of(err);
      }
      )
    ).subscribe();

    this.file = null
  }
  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }


  onSubmit(addQuizForm: NgForm) {
    this.backend.createQuiz(this.formData()).pipe(
      tap(() => {
        this.submitionStatus.set(200);
        this.formData().questions = [];
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
}

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
import { MatDialog } from '@angular/material/dialog';
import { DeleteQuizDialogComponent } from './delete-quiz-dialog/delete-quiz-dialog.component';
import { environment } from '../../../../environments/environment';

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
  protected readonly fileSubmitionStatus = signal<number[]>([]);
  protected readonly loading = signal<Record<number, boolean>>({});
  private files: Record<number, File | null> = {};
  protected readonly dialog = inject(MatDialog);
  protected readonly updateResponse = signal<string>('');
  protected readonly apiUrl = environment.apiUrl;


  protected formData = computed(() => {
    return {
      title: this.activeQuiz()?.title,
      _id: this.activeQuiz()?._id,
      questions: this.activeQuiz()?.questions,
      answers: this.activeQuiz()?.answers,
    }
  });

  checkMediaType(fileUrl: string | undefined) {
    if (!fileUrl) return 'unknown';
    if (fileUrl.match(/\.(jpg|jpeg|png|gif)$/i)
      || fileUrl.match(/image/)) return 'image';
    if (fileUrl.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    return 'unknown';
  }

  addQuestion() {
    this.formData().questions.push({
      title: "",
      imageUrl: "",
      possible_answers: [{ id: 1, value: "" }, { id: 2, value: "" }, { id: 3, value: "" }, { id: 4, value: "" }],
      weight: 1,
      openEnded: false,
    });
  }

  deleteQuestion(index: number) {
    this.formData().questions = this.formData().questions.filter((_, i) => i !== index);
  }

  deleteQuiz() {
    const dialogRef = this.dialog.open(DeleteQuizDialogComponent);
    dialogRef.afterClosed().subscribe(confirmedDeletion => {
      if (!confirmedDeletion) return;

      this.backend.deleteQuiz(this.selectedQuiz()).pipe(
        concatMap(() => this.backend.getAllquizzes()
          .pipe(
            tap((quizzes: Quiz[]) => this.dashboardService.quizzes.set(quizzes))
          )
        ),
      ).subscribe();
      this.selectedQuiz.set(-1);
    });
  }

  triggerFileInput(index: number) {
    const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  hasFileForQuestion(index: number): boolean {
    return !!this.files[index];
  }

  isLoadingForQuestion(index: number): boolean {
    return !!this.loading()[index];
  }

  getFileStatus(index: number): number {
    const statuses = this.fileSubmitionStatus();
    return statuses[index] ?? -1;
  }

  upload(index: number) {
    const file = this.files[index];
    if (!file) return;

    this.loading.update(loading => ({ ...loading, [index]: true }));
    
    const fd = new FormData();
    fd.append('file', file);
    
    this.backend.uploadFile(fd).pipe(
      tap(resp => {
        if (this.formData().questions[index]) {
          this.formData().questions[index].imageUrl = resp.path;
        }
      }),
      tap(_ => {
        this.fileSubmitionStatus.update(arr => {
          const newArr = [...(arr || [])];
          while (newArr.length <= index) {
            newArr.push(-1);
          }
          newArr[index] = 200;
          return newArr;
        });
      }),
      catchError(err => {
        this.fileSubmitionStatus.update(arr => {
          const newArr = [...(arr || [])];
          while (newArr.length <= index) {
            newArr.push(-1);
          }
          newArr[index] = err.status || 500;
          return newArr;
        });
        return of(err);
      })
    ).subscribe({
      complete: () => {
        this.loading.update(loading => ({ ...loading, [index]: false }));
        this.files[index] = null;
        // Reset the file input
        const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    });
  }

  onFile(e: Event, index: number) {
    const input = e.target as HTMLInputElement;
    this.files[index] = input.files?.[0] ?? null;
  }


  submitQuiz(addQuizForm: NgForm) {
    this.backend.updateQuiz(this.formData()).pipe(
      tap(() => {
        this.submitionStatus.set(200);
        this.formData().questions = [];
        addQuizForm.resetForm();
        this.selectedQuiz.set(-1);
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

  removeFile(question: any){
    question.imageUrl = '';
  }
  
  getURL(fileUrl: string = ''): string {
    if (!fileUrl) return '';
    return this.apiUrl + fileUrl;
  }
}

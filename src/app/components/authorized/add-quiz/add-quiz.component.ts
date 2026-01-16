import { Component, inject, signal } from '@angular/core';
import { newQuiz, Quiz } from '../../../shared/models/quiz';
import { FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { catchError, concatMap, of, tap } from 'rxjs';
import { AlertComponent } from '@coreui/angular';
import { DashboardService } from '../../../services/dashboard.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'add-quiz',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    MatIcon
  ],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.scss'
})
export class AddQuizComponent {
  backend = inject(BackendService);
  dashboardService = inject(DashboardService);

  protected newQuiz: Quiz = newQuiz;
  protected readonly submitionStatus = signal<number>(-1);

  addQuestion() {
    this.newQuiz.questions.push({
      title: "",
      possible_answers: [{ id: 1, value: "" }, { id: 2, value: "" }, { id: 3, value: "" }, { id: 4, value: "" }],
      weight: 1
    });
  }

  deleteQuestion(index: number){
    this.newQuiz.questions = this.newQuiz.questions.filter((_, i) => i !== index);
  }

  form = new FormGroup({
    title: new FormControl(''),
    questions: new FormArray<FormGroup>([]),
  });


  onSubmit(addQuizForm: NgForm) {
    this.backend.createQuiz(this.newQuiz).pipe(
      tap(() => {
        this.submitionStatus.set(200);
        this.newQuiz.questions = [];
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

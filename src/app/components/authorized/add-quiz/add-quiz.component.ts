import { Component, inject, signal } from '@angular/core';
import { newQuiz, Quiz } from '../../../shared/models/quiz';
import { FormArray, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { catchError, of, tap } from 'rxjs';
import { AlertComponent } from '@coreui/angular';

@Component({
  selector: 'add-quiz',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlertComponent
  ],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.scss'
})
export class AddQuizComponent {
  backend = inject(BackendService);

  protected newQuiz: Quiz = newQuiz;
  protected readonly submitionStatus = signal<number>(-1);

  addQuestion() {
    this.newQuiz.questions.push({
      title: "",
      possible_answers: [{ id: 1, value: "" }, { id: 2, value: "" }, { id: 3, value: "" }, { id: 4, value: "" }],
      weight: 1
    });
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
      catchError(err => {
        this.submitionStatus.set(err.status);
        return of(err);
      })
    ).subscribe();
  }

}

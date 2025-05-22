import { ChangeDetectionStrategy, Component, computed, inject, Input, input, Signal, WritableSignal } from '@angular/core';
import { Answer, Question } from '../../../shared/models/question';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'question-card',
  imports: [],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionCardComponent {
  readonly appService = inject(AppService);
  @Input({ required: true }) userEntries!: WritableSignal<(number | string)[]>;

  apiUrl = environment.apiUrl;
  questionIndex = input<number>(0);
  question = input.required<Question>();

  title = computed(() => this.question()?.title);
  possible_answers = computed(() => this.question()?.possible_answers);


  getTitle() {
    return "שאלה " + (this.questionIndex() + 1) + ": " + this.title();
  }

  userAnswered(answer: Event | number | string) {
    const index = this.questionIndex() + 1;
    const newUserEntries = [...this.userEntries()];
    if (answer instanceof Event)
      newUserEntries[index] = (answer.target as HTMLTextAreaElement).value;
    else
      newUserEntries[index] = answer;

    this.userEntries.set(newUserEntries);
  }

  highlightSelectedAnswer(answerIndex: number) {
    return this.userEntries().at(this.questionIndex() + 1) === (answerIndex + 1) ? "highlight" : "";
  }
}

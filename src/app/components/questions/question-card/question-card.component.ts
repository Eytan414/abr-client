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
  MIN_ANSWER_LENGTH = 5;
  apiUrl = environment.apiUrl;
  questionIndex = input<number>(0);
  question = input.required<Question>();

  title = computed(() => this.question()?.title);
  possible_answers = computed(() =>
    this.shuffle(
      this.question()?.possible_answers
    )
  );


  getTitle() {
    return "שאלה " + (this.questionIndex() + 1) + ": " + this.title();
  }

  userAnswered(answer: Event | number) {
    const index = this.questionIndex() + 1;
    const newUserEntries = [...this.userEntries()];

    if (!(answer instanceof Event)) {
      newUserEntries[index] = answer;
      this.userEntries.set(newUserEntries);
      return;
    }

    const textAreaValue = (answer.target as HTMLTextAreaElement).value;
    if (textAreaValue.length >= this.MIN_ANSWER_LENGTH)
      newUserEntries[index] = textAreaValue;
    this.userEntries.set(newUserEntries);
  }

  highlightSelectedAnswer(answerId: number) {
    return this.userEntries().at(this.questionIndex() + 1) === answerId ? "highlight" : "";
  }

  private shuffle(array: Answer[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}

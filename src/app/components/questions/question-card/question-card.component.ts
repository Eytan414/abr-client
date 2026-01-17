import { ChangeDetectionStrategy, Component, computed, inject, input, WritableSignal } from '@angular/core';
import { Answer, Question } from '../../../shared/models/question';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../services/app.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'question-card',
  imports: [MatIcon],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionCardComponent{
  protected readonly appService = inject(AppService);

  readonly userEntries = input.required<WritableSignal<(number | string)[]>>();
  readonly questionIndex = input<number>(0);
  readonly question = input.required<Question>();

  private MIN_ANSWER_LENGTH = 5;
  protected apiUrl = environment.apiUrl;

  protected readonly title = computed(() => this.question()?.title);
  protected readonly possible_answers = computed(() =>
    this.shuffle(
      this.question()?.possible_answers
    )
  );

  checkMediaType(fileUrl: string){
    return fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' :
    fileUrl.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'unknwon';

  }

  protected getTitle() {
    return "שאלה " + (this.questionIndex() + 1) + ": " + this.title();
  }

  protected userAnswered(answer: Event | number) {
    const index = this.questionIndex() + 1;
    const newUserEntries = [...this.userEntries()()];

    if (!(answer instanceof Event)) {
      newUserEntries[index] = answer;
      this.userEntries().set(newUserEntries);
      return;
    }

    const textAreaValue = (answer.target as HTMLTextAreaElement).value;
    if (textAreaValue.length >= this.MIN_ANSWER_LENGTH)
      newUserEntries[index] = textAreaValue;
    this.userEntries().set(newUserEntries);
  }

  protected highlightSelectedAnswer(answerId: number) {
    return this.userEntries()().at(this.questionIndex() + 1) === answerId ? "highlight" : "";
  }

  private shuffle(array: Answer[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}

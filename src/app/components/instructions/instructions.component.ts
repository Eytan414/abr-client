import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'instructions',
  imports: [],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InstructionsComponent {
  private readonly router = inject(Router);

  protected startQuiz() {
    this.router.navigateByUrl('/questions');
  }

}

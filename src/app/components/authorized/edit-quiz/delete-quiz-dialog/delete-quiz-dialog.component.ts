import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-quiz-dialog',
  imports: [
    MatDialogModule, 
    MatButtonModule,
  
  ],
  templateUrl: './delete-quiz-dialog.component.html',
  styleUrl: './delete-quiz-dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class DeleteQuizDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef)

}

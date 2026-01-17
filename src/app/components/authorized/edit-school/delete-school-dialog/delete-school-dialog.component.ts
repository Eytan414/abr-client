import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-school-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-school-dialog.component.html',
  styleUrl: './delete-school-dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteSchoolDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef)
}

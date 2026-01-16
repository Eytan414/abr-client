import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-school-dialog',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButtonModule
  ],
  templateUrl: './delete-school-dialog.component.html',
  styleUrl: './delete-school-dialog.component.scss'
})
export class DeleteSchoolDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef)
}

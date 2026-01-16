import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { AlertComponent, PlaceholderDirective } from '@coreui/angular';
import { SchoolToAdd } from '../../../shared/models/types';
import { FormsModule, NgForm } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'add-school',
  imports: [
    FormsModule,
    AlertComponent,
    PlaceholderDirective
],
  templateUrl: './add-school.component.html',
  styleUrl: './add-school.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSchoolComponent {
  private readonly backend = inject(BackendService);
  protected readonly dashboardService = inject(DashboardService);
  
  protected readonly schoolName = signal<string>('');
  protected readonly supervisorName = signal<string>('');
  protected readonly supervisorPhone = signal<string>('');
  protected readonly assignedQuiz = signal<number>(-1);
  protected readonly submitionStatus = signal<number>(-1);
  @ViewChild('addSchoolForm') addSchoolForm!: NgForm;

  onSubmit() {
    const requestBody: SchoolToAdd = {
      name: this.schoolName(),
      quizId: +this.assignedQuiz(),
      supervisor: {
        phone: this.supervisorPhone(),
        name: this.supervisorName()
      }
    }
    this.backend.addSchool(requestBody)
      .pipe(
        tap(() => {
          this.submitionStatus.set(200);
          this.addSchoolForm.resetForm();
        }),
        catchError(err => {
          this.submitionStatus.set(err.status);
          return of(err);
        })
      ).subscribe();
  }
}
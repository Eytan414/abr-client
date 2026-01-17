import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { tap } from 'rxjs';
import { Supervisor } from '../../../shared/models/supervisor';
import { AlertComponent } from '@coreui/angular';
import { AppService } from '../../../services/app.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSchoolDialogComponent } from './delete-school-dialog/delete-school-dialog.component';

@Component({
  selector: 'edit-school',
  imports: [
    FormsModule,
    AlertComponent,
    MatProgressSpinnerModule,
    MatIcon,
    DeleteSchoolDialogComponent,
    // MatDialog
  ],
  templateUrl: './edit-school.component.html',
  styleUrl: './edit-school.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSchoolComponent {
  private readonly backend = inject(BackendService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly appService = inject(AppService);
  protected readonly dialog = inject(MatDialog);

  protected readonly selectedSchool = signal<string>('');
  protected readonly activeSupervisor = signal<Supervisor>({} as Supervisor);
  protected readonly activeSchool = computed(() => {
    const schools = untracked(() => this.appService.schools());
    return schools.find(school => school._id === this.selectedSchool());
  });

  protected updateResponse = signal<string>('');
  protected readonly loading = signal<boolean>(false);

  protected formData = computed(() => {
    return {
      schoolId: this.activeSchool()?._id,
      schoolName: this.activeSchool()?.name,
      quizId: this.activeSchool()?.quizId,
      supervisorName: this.activeSupervisor()?.name,
      supervisorPhone: this.activeSupervisor()?.phone,
    }
  });

  private superEffect = effect(() => {
    const schoolId = this.selectedSchool();
    if (!schoolId) return;
    this.backend.getSupervisorBySchool(schoolId).pipe(
      tap(this.activeSupervisor.set)
    ).subscribe()
  });


  onSubmit(addSchoolForm: NgForm) {
    const payload = {
      _id: this.activeSupervisor()._id,
      name: this.formData().supervisorName,
      phone: this.formData().supervisorPhone,
      quizId: this.formData().quizId,
      schoolId: this.formData().schoolId ?? this.activeSchool()!._id,
      schoolName: this.formData().schoolName ?? this.activeSchool()!.name,
    };
    this.backend.updateSupervisorAndSchool(payload)
      .pipe(
        tap(resp => this.updateResponse.set(resp.result)),
        tap(_ => this.selectedSchool.set('')),
        tap(_ => addSchoolForm.resetForm())
      )
      .subscribe();

  }


  deleteSchool() {
    const dialogRef = this.dialog.open(DeleteSchoolDialogComponent);
    dialogRef.afterClosed().subscribe(confirmedDeletion => {
      if (!confirmedDeletion) return;
      
      this.backend.deleteSchool(this.activeSchool()!._id).pipe(
        tap(() => this.updateResponse.set),
        tap(() => this.loadSchools()),
      ).subscribe();
    });
  }

  loadSchools() {
    this.loading.set(true);
    this.backend.getSchoolList()
      .pipe(
        tap(this.appService.schools.set),
        tap(() => this.loading.set(false))
      )
      .subscribe();
  }
}

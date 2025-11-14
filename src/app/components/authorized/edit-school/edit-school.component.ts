import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { tap } from 'rxjs';
import { Supervisor } from '../../../shared/models/supervisor';
import { AlertComponent } from '@coreui/angular';

@Component({
  selector: 'edit-school',
  imports: [FormsModule, AlertComponent],
  templateUrl: './edit-school.component.html',
  styleUrl: './edit-school.component.scss'
})
export class EditSchoolComponent {
  private readonly backend = inject(BackendService);
  protected readonly dashboardService = inject(DashboardService);
  
  protected readonly selectedSchool = signal<string>('');
  protected readonly activeSupervisor = signal<Supervisor>({} as Supervisor);
  protected readonly activeSchool = computed(() => {
    const schools = untracked(() => this.dashboardService.schoolsDataAdmin());
    return schools.find(school => school.id === this.selectedSchool());
  });
  
  protected updateResponse = signal<string>('');

  protected formData = computed(() => {
    return {
      schoolId: this.activeSchool()?.id,
      schoolName: this.activeSchool()?.name,
      supervisorName: this.activeSupervisor()?.name,
      supervisorPhone: this.activeSupervisor()?.phone,
    }
  });

  private superEffect = effect(() => {
    const schoolId = this.selectedSchool();
    if(!schoolId) return;
    this.backend.getSupervisorBySchool(schoolId).pipe(
      tap(this.activeSupervisor.set)
    ).subscribe()
  });
  
  
  onSubmit(addSchoolForm: NgForm){
    const payload = {
      _id: this.activeSupervisor()._id,
      name: this.formData().supervisorName,
      phone: this.formData().supervisorPhone,
      schoolId: this.formData().schoolId ?? this.activeSchool()!.id,
      schoolName: this.formData().schoolName ?? this.activeSchool()!.name,
    };
    this.backend.updateSupervisorAndSchool(payload)
    .pipe(
      tap( resp => this.updateResponse.set(resp.result) ),
      tap( _ => this.selectedSchool.set('') ),
      tap( _ => addSchoolForm.resetForm() )
    )
    .subscribe();
    
  }
  
  
}

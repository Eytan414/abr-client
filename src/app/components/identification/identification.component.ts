import { ChangeDetectionStrategy, Component, computed, inject, Injector, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'identification',
  imports: [FormsModule],
  templateUrl: './identification.component.html',
  styleUrl: './identification.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentificationComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly backend = inject(BackendService);
  private readonly appService = inject(AppService);
  schools = this.appService.schools;
  name = signal<string>('');
  phone = signal<string>('');
  school = signal<number>(-1);

  areDetailsFilled = computed(() =>
    this.name().trim() !== '' &&
    this.phone().trim() !== '' &&
    this.school() !== -1
  );

  ngOnInit(): void {
    this.backend.getSchoolList().subscribe();
  }

  updateUserDetails(schoolId: number = +this.school()) {
    this.appService.userDetails.update(u => ({
      ...u,
      name: this.name(),
      phone: this.phone(),
      schoolId: schoolId,
    }));
  }

  checkIfSupervisor() {
    this.backend.checkIsSuper(this.phone()).pipe(
      tap((result) => {
        if(result.supervisor){
          this.updateUserDetails(result.supervisor.schoolId);
          this.gotoResults();
        }
        else{
          this.updateUserDetails();
          this.gotoInstructions();
        }
      })
    ).subscribe();
  }

  gotoResults() {
    this.router.navigateByUrl('/results', { skipLocationChange: true });
  }
  gotoInstructions() {
    this.router.navigateByUrl('/instructions', { skipLocationChange: true });
  }
}

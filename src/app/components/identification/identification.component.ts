import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { finalize, tap } from 'rxjs/operators';
import { AppService } from '../../services/app.service';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'identification',
  imports: [
    FormsModule,
    MatProgressSpinnerModule
  ],
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
  grade = signal<string>('');
  phone = signal<string>('');
  school = signal<string>('');
  password = signal<string>('');
  isMemberFlow = signal<boolean>(false);
  loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const val = this.phone();
      if (/^\d{10}$/.test(val)) {
        this.loading.set(true);
        this.backend.checkIsSuper(this.phone()).pipe(
          tap((s) => {
            const schoolId = s.supervisor?.schoolId;
            if(schoolId) {
              this.appService.userDetails.update(u => ({ ...u, schoolId }) );
              this.isMemberFlow.set(true);
            }
          }),
          finalize(() => {debugger; this.loading.set(false)})
        ).subscribe();
      } else {
        this.isMemberFlow.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.backend.getSchoolList().subscribe();
  }

  login() {
    this.backend.login(this.password()).subscribe();
  }
  checkIfSupervisor() {
    if (this.isMemberFlow()) {
      this.login();
      return;
    }
    this.backend.checkIsSuper(this.phone()).pipe(
      tap((result) => {
        if (result.supervisor) {
          this.updateUserDetails(result.supervisor.schoolId);
          this.router.navigateByUrl('/manage');
        }
        else {
          this.updateUserDetails();
          this.gotoInstructions();
        }
      })
    ).subscribe();
  }

  updateUserDetails(schoolId: string = this.school()) {
    this.appService.userDetails.update(u => ({
      ...u,
      schoolId,
      name: this.name(),
      grade: this.grade(),
      phone: this.phone(),
    }));
  }

  gotoInstructions() {
    this.router.navigateByUrl('/instructions');
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.phone.set(value);
  }
}

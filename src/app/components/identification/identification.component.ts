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
  private readonly PHONE_REGEX = /^\d{10}$/;
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
      const phone = this.phone();
      if (!this.PHONE_REGEX.test(phone)) {
        this.isMemberFlow.set(false);
        return;
      }
      this.loading.set(true);
      this.backend.checkIsSuper(phone).pipe(
        tap((s) => {
          const schoolId = s.supervisor?.schoolId;
          if (schoolId) {
            this.appService.userDetails.update(u => ({ ...u, schoolId }));
            this.isMemberFlow.set(true);
          }
        }),
        finalize(() => this.loading.set(false))
      ).subscribe();
    });
  }

  ngOnInit(): void {
    this.backend.getSchoolList()
      .pipe(tap(this.appService.schools.set))
      .subscribe();
  }

  login() {
    if (this.isMemberFlow()) {
      this.backend.login(this.password()).subscribe();
      return;
    }
    this.updateUserDetails();
    this.router.navigateByUrl('/instructions');
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

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.phone.set(value);
  }
  
}

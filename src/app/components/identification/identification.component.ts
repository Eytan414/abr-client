import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
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
  private readonly PHONE_REGEX = /^\d{10}$/;
  private readonly router = inject(Router);
  private readonly backend = inject(BackendService);
  private readonly appService = inject(AppService);
  protected readonly schools = this.appService.schools;
  protected readonly name = signal<string>('');
  protected readonly grade = signal<string>('');
  protected readonly phone = signal<string>('');
  protected readonly school = signal<string>('');
  protected readonly password = signal<string>('');
  protected readonly isMemberFlow = signal<boolean>(false);
  protected readonly loginCheckLoading = signal<boolean>(false);
  protected readonly phoneCheckLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const phone = this.phone();
      if (!this.PHONE_REGEX.test(phone)) {
        this.isMemberFlow.set(false);
        return;
      }
      this.phoneCheckLoading.set(true);
      this.backend.checkIsSuper(phone).pipe(
        tap((resp) => {
          if (resp.supervisor) {
            const { schoolId, phone, name } = resp.supervisor;
            this.appService.userDetails.update(u => ({ ...u, schoolId, phone, name }));
            this.isMemberFlow.set(true);
          }
        }),
        finalize(() => this.phoneCheckLoading.set(false))
      ).subscribe();
    });
  }

  ngOnInit(): void {
    this.backend.getSchoolList()
      .pipe(tap(this.appService.schools.set))
      .subscribe();
  }


  protected login() {
    this.loginCheckLoading.set(true);
    if (this.isMemberFlow()) {
      this.backend.login(this.password()).pipe(
        finalize(() => this.loginCheckLoading.set(false)))
        .subscribe();
      return;
    }
    this.updateUserDetails();
    this.router.navigateByUrl('/instructions');

    const message = JSON.stringify(this.appService.userDetails());
    this.backend.saveLog('info', message, 'student clicks instruc\'s page').subscribe();
  }

  private updateUserDetails(schoolId: string = this.school()) {
    this.appService.userDetails.update(u => ({
      ...u,
      schoolId,
      name: this.name(),
      grade: this.grade(),
      phone: this.phone(),
    }));
  }

  protected onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.phone.set(value);
  }

}

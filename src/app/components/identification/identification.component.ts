import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { SchoolDTO } from '../../shared/models/school';
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
export class IdentificationComponent implements OnInit{
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

  gotoInstructions() {
    this.appService.userDetails.update(u => (
      {
        ...u,
        name: this.name(),
        phone: this.phone(), 
        schoolId: +this.school(),
      }));
    this.router.navigateByUrl('/instructions', { skipLocationChange: true });
  }
}

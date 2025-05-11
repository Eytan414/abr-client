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
  grade = signal<string>('');
  phone = signal<string>('');
  school = signal<string>('');

  areDetailsFilled = computed(() =>
    this.name().trim() !== '' &&
    this.phone().trim() !== '' &&
    this.grade().trim() !== '' &&
    this.school().trim() !== ''
  );

  ngOnInit(): void {
    this.backend.getSchoolList().subscribe();
  }

  updateUserDetails(id: string = this.school()) {
    this.appService.userDetails.update(u => ({
      ...u,
      _id:id,
      name: this.name(),
      grade: this.grade(),
      phone: this.phone(),
    }));
  }

  checkIfSupervisor() {
    this.backend.checkIsSuper(this.phone()).pipe(
      tap((result) => {
        if(result.supervisor){
          this.updateUserDetails(result.supervisor._id);
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

import { ChangeDetectionStrategy, Component, computed, inject, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'results',
  imports: [
    FormsModule,
    NgComponentOutlet
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent {
  scoresComponent = this.injectComponent(() => import('../scores-table/scores-table.component').then(m => m.ScoresTableComponent));
  passwordsComponent = this.injectComponent(() => import('../passwords-table/passwords-table.component').then(m => m.PasswordsTableComponent));
  addSchoolComponent = this.injectComponent(() => import('../add-school/add-school.component').then(m => m.AddSchoolComponent));

  readonly dashboardService = inject(DashboardService);
  isAuthenticated = computed(() => this.dashboardService.role() !== 'unidentified');

  injectComponent<T>(loader: () => Promise<Type<T>>) {
    const comp = signal<Type<T> | null>(null); 
    loader().then(comp.set);
    return comp;
  }

}

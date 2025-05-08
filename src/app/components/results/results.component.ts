import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { AppService } from '../../services/app.service';
import { JsonPipe } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MatTableModule } from '@angular/material/table';
import { ScoresTableComponent } from "./scores-table/scores-table.component";
import { PasswordsTableComponent } from "./passwords-table/passwords-table.component";

@Component({
  selector: 'app-results',
  imports: [
    FormsModule,
    MatTableModule,
    ScoresTableComponent,
    PasswordsTableComponent
],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent {
  private readonly backend = inject(BackendService);
  readonly dashboardService = inject(DashboardService);
  
  password = '';
  isAuthenticated = computed(() => this.dashboardService.role() !== 'unidentified');

//   tst = computed(() => 
//     this.results().map((record: TableData) => ({
//       name: record.name,
//       score: record.score,
//     }))
// );

  // tableData:Array<Partial<TableData>> = computed(() => {
  //   // this.results()
  //   [].map((record: TableData) => ({
  //     name: record.name,
  //     score: record.score,
  //   }))
  // })
  


  onSubmit() {
    this.backend.login(this.password).subscribe();
  }

}

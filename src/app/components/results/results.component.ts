import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { AppService } from '../../services/app.service';
import { JsonPipe } from '@angular/common';
import { DashboardService, TablePassword } from '../../services/dashboard.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-results',
  imports: [
    FormsModule,
    JsonPipe,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent {
  private readonly backend = inject(BackendService);
  private readonly appService = inject(AppService);
  readonly dashboardService = inject(DashboardService);
  
  password = '';
  isAuthenticated = computed(() => this.dashboardService.role() !== 'unidentified');

  results = computed(() => this.appService.scoresData());

  // tableData:Array<Partial<TableData>> = computed(() => {
  //   // this.results()
  //   [].map((record: TableData) => ({
  //     name: record.name,
  //     score: record.score,
  //   }))
  // })
  editCell(element:TablePassword){
    element.isEditing = true;
  }
  saveCell(element:TablePassword){
    element.isEditing = false;
    this.backend.updatePassword(element.id, element.password).subscribe();
  }
  passmepass(){
    this.backend.passmepass().subscribe();
  }

  onSubmit() {
    this.backend.login(this.password).subscribe();
  }

}

type TableData = {
  phone: string,
  name: string,
  score: number,
  userEntries: number[],
  timestamp: Date,
}
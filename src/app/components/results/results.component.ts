import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { map } from 'rxjs';
import { AppService } from '../../services/app.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [
    FormsModule,
    JsonPipe
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent {
  private readonly backend = inject(BackendService);
  private readonly appService = inject(AppService);
  password = '';
  isAuthenticated = signal<boolean>(false);
  results = computed(() => this.appService.scoresData());
  
  // tableData:Array<Partial<TableData>> = computed(() => {
  //   // this.results()
  //   [].map((record: TableData) => ({
  //     name: record.name,
  //     score: record.score,
  //   }))
  // })

  onSubmit() {
    this.backend.authenticate(this.password)
      .pipe(map((isAuth: boolean) => this.isAuthenticated.set(isAuth)))
      .subscribe();
  }
}

type TableData = {
  phone: string,
  name: string,
  score: number,
  userEntries: number[],
  timestamp: Date,
}
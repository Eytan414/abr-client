import { computed, inject, Injectable, signal } from '@angular/core';
import { AppService } from './app.service';
import { School, ScoresData } from '../shared/models/types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly appService = inject(AppService)

  passwords = signal<TablePassword[]>([]);
  scoresTableLoading = signal<boolean>(false);
  scoresDataAdmin = signal<School[]>([]);
  scoresData = signal<ScoresData>({
    scoresBySchool: [],
    quizDistinctDates: [],
  });
}


export type TablePassword = {
  id: string,
  password: string,
  isEditing: boolean,
}
type studentSheetData = {
  studentAnswer: string,
  question: string,
  correctAnswer: string,
}
import { computed, Injectable, signal } from '@angular/core';
import { Log, School, ScoresData } from '../shared/models/types';
import { Quiz } from '../shared/models/quiz';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  logs = signal<Log[]>([]);
  passwords = signal<TablePassword[]>([]);
  scoresTableLoading = signal<boolean>(false);
  schoolsWithScoresForAdmin = signal<School[]>([]);
  allschoolsForAdmin = signal<School[]>([]);
  scoresData = signal<ScoresData>({
    scoresBySchool: [],
    quizDistinctDates: [],
  });
  recordCount = computed(() => this.scoresData().scoresBySchool.length)
  quizzes = signal<Quiz[]>([]);

}


export type TablePassword = {
  id: string,
  password: string,
  isEditing: boolean,
}
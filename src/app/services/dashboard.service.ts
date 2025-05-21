import { Injectable, signal } from '@angular/core';
import { School, ScoresData } from '../shared/models/types';
import { Quiz } from '../shared/models/quiz';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  passwords = signal<TablePassword[]>([]);
  scoresTableLoading = signal<boolean>(false);
  scoresDataAdmin = signal<School[]>([]);
  scoresData = signal<ScoresData>({
    scoresBySchool: [],
    quizDistinctDates: [],
  });

  quizzes = signal<Quiz[]>([]);

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
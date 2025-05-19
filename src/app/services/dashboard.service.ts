import { computed, inject, Injectable, signal } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly appService = inject(AppService)

  passwords = signal<TablePassword[]>([]);
  currentSchoolSupervisors = signal<any[]>([]);
  scoresTableLoading = signal<boolean>(false);

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
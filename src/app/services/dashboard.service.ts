import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  passwords = signal<TablePassword[]>([]);
  role = signal<string>('unidentified');

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
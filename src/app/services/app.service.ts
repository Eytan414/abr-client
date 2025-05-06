import { computed, Injectable, signal } from '@angular/core';
import { Question } from '../shared/models/question';
import { SchoolDTO } from '../shared/models/school';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  questions = signal<Question[]>([]);
  schools = signal<SchoolDTO[]>([]);
  userDetails = signal<UserDetails>({schoolId:-1});
  quizId = computed(() => {
    return this.schools().find(s => s.schoolId === this.userDetails().schoolId)?.quizId
  });
  scoresData = signal({});

}
type UserDetails = {
  readonly name?: string;
  readonly phone?: string;
  readonly schoolId: number;
}
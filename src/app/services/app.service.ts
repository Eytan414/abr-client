import { computed, Injectable, signal } from '@angular/core';
import { Question } from '../shared/models/question';
import { SchoolDTO } from '../shared/models/school';
import { UserDetails } from '../shared/models/types';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  questions = signal<Question[]>([]);
  schools = signal<SchoolDTO[]>([]);
  userDetails = signal<UserDetails>({});
  quizId = computed(() => { return this.schools().find(s => s._id === this.userDetails().schoolId)?.quizId });

  responseSignal = signal<Resp>({});
  quizSent = computed(() => this.responseSignal().resp === 'success');

}




type Resp = {
  resp?: any;
  savedQuiz?: any;
};


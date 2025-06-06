import { computed, Injectable, signal } from '@angular/core';
import { Question } from '../shared/models/question';
import { SchoolDTO } from '../shared/models/school';
import { UserDetails } from '../shared/models/types';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  questions = signal<Question[]>([]);
  readonly indicatorsArray = computed<undefined[]>(() => { //idc about type, just need an array of the same length as questions
    const count = this.questions().length;
    return Array.from({ length: count });
  });

  schools = signal<SchoolDTO[]>([]);
  userDetails = signal<UserDetails>({});
  quizId = computed(() => { return this.schools().find(s => s._id === this.userDetails().schoolId)?.quizId });

  responseSignal = signal<Resp>({ resp: -1 });
  quizSent = computed(() => this.responseSignal().resp !== -1);
  sessionId = signal<string>('no_session');

  constructor() {
    window.name = window.name ||= Math.random().toString(36).slice(2); //generate pseudo-random session ID
    this.sessionId.set(window.name);
  }
}




export type Resp = {
  resp?: any;
  savedQuiz?: any;
};


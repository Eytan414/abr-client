import { computed, Injectable, signal } from '@angular/core';
import { Question } from '../shared/models/question';
import { SchoolDTO } from '../shared/models/school';
import { ScoresData } from '../shared/models/types';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  questions = signal<Question[]>([]);
  userDetails = signal<UserDetails>({});
  schools = signal<SchoolDTO[]>([]);
  quizId = computed(() => { return this.schools().find(s => s._id === this.userDetails().schoolId)?.quizId });
  scoresData = signal<ScoresData>({
    scoresBySchool: [],
    quizDistinctDates: []
  });
  responseSignal = signal<Resp>({});
  quizSent = computed(() => this.responseSignal().resp === 'success');

}


type UserDetails = {
  readonly name?: string;
  readonly phone?: string;
  readonly grade?: string;
  readonly role?: string;
  readonly schoolId?: string;
}

type Resp = {
  resp?: any;
  savedQuiz?: any;
};


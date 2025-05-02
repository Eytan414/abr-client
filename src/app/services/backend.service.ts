import { HttpClient, } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Quiz } from '../shared/models/quiz';
import { tap } from 'rxjs';
import { AppService } from './app.service';
import { SchoolDTO } from '../shared/models/school';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly http = inject(HttpClient);
  private readonly appService = inject(AppService);
  // url = 'https://nxaugrrrrm.loclx.io/';
  // url = 'http://localhost:3300/';
  url = 'https://abr-server-production.up.railway.app/';

  
  getQuizById(){
    const id = this.appService.quizId();
    return this.http.get<Quiz>(`${this.url}${id}`)
      .pipe(tap(quiz => {
        this.appService.questions.set(quiz.questions);
      }));
  }
  submitData(body:any){
    return this.http.post(this.url, body);
  }
  getSchoolList(){
    return this.http.get<SchoolDTO[]>(`${this.url}school/all`)
    .pipe(tap(schools => this.appService.schools.set(schools)));
  }

}

import { HttpClient, } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Quiz } from '../shared/models/quiz';
import { finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { AppService } from './app.service';
import { SchoolDTO } from '../shared/models/school';
import { Supervisor } from '../shared/models/supervisor';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly appService = inject(AppService);
  // url = 'http://localhost:3300/';
  // url = 'https://abr-server-production.up.railway.app/';

  private isAuthenticated = signal<boolean>(false);

  getQuizById() {
    const id = this.appService.quizId();
    return this.http.get<Quiz>(`${environment.apiUrl}quiz/${id}`)
      .pipe(tap(quiz => {
        this.appService.questions.set(quiz.questions);
      }));
  }
  submitData(body: any) {
    return this.http.post(`${environment.apiUrl}scores`, body);
  }
  getSchoolList() {
    return this.http.get<SchoolDTO[]>(`${environment.apiUrl}school/all`)
      .pipe(tap(schools => this.appService.schools.set(schools)));
  }

  checkIsSuper(phone: string) {
    return this.http.get<{ supervisor: null | Supervisor }>(`${environment.apiUrl}supervisor/is-super/${phone}`);
  }

  checkPassword(password: string) {
    return this.http.post<{ passValid: boolean }>(`${environment.apiUrl}supervisor/checkPassword`, { password }, { withCredentials: true });
  }

  fetchResultsBySchool(schoolId: number) {
    return this.http.get(`${environment.apiUrl}scores/by-supervisor/${schoolId}`, { withCredentials: true });
  }

  authenticate(password: string): Observable<boolean> {
    const supervisorSchool = this.appService.userDetails().schoolId;

    return this.http.post<{ passValid: boolean }>(`${environment.apiUrl}supervisor/checkPassword`, { password }).pipe(
      switchMap(result => result.passValid
        ? this.fetchResultsBySchool(supervisorSchool)
          .pipe(map((scores) => {
            this.appService.scoresData.set(scores);
            return true;
          }))
        : of(false)
      ),
      map(isAuthenticated => {
        this.isAuthenticated.set(isAuthenticated);
        return isAuthenticated; 
      }),
      finalize(() => {
        if (!this.isAuthenticated()) {
          this.router.navigateByUrl('/', { skipLocationChange: true });
        }
      })
    );
  }
}
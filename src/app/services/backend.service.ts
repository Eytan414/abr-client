import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { AppService } from './app.service';
import { DashboardService } from './dashboard.service';
import { SheetData } from '../components/authorized/student-sheet/student-sheet.component';
import { ScoreRecord, ScoresData } from '../shared/models/types';
import { SchoolToAdd } from '../shared/models/types';
import { Supervisor } from '../shared/models/supervisor';
import { Quiz } from '../shared/models/quiz';
import { SchoolDTO } from '../shared/models/school';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly appService = inject(AppService);
  private readonly dashboardService = inject(DashboardService);
  private isAuthenticated = signal<boolean>(false);

  getAllQuizzes() {
    return this.http.get<Quiz[]>(`${environment.apiUrl}quiz/`);
  }
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
      .pipe(tap(schoolsList => this.appService.schools.set(schoolsList)));
  }

  checkIsSuper(phone: string) {
    return this.http.get<{ supervisor: null | Supervisor }>(`${environment.apiUrl}supervisor/is-super/${phone}`);
  }

  fetchResultsBySchool(schoolId: string) {
    return this.http.get<ScoresData>(`${environment.apiUrl}scores/by-supervisor/${schoolId}`, { withCredentials: true });
  }

  login(password: string): Observable<string> {
    const supervisorSchool = this.appService.userDetails().schoolId;
    if (!supervisorSchool) return of('unidentified');

    return this.http.post<{ role: string }>(`${environment.apiUrl}supervisor/login`, { value: password }, { withCredentials: true })
      .pipe(switchMap(result => {
        if (result.role === 'unidentified') {
          return of('unidentified');
        }
        else {
          this.appService.userDetails.update(ud => ({ ...ud, role: result.role }));
          return this.fetchResultsBySchool(supervisorSchool)
            .pipe(map((scoresResp: ScoresData) => {
              const scoresWithFormattedDate = scoresResp.scoresBySchool
                .map((record: ScoreRecord) => ({ ...record, date: record.timestamp.split('T')[0] }));
              scoresResp.scoresBySchool = scoresWithFormattedDate;
              this.appService.scoresData.set(scoresResp);
              return result.role;
            }))
        }
      }),
        map(role => {
          this.dashboardService.role.set(role);
          return role;
        }),
        finalize(() => {
          if (this.dashboardService.role() === 'unidentified') {
            this.router.navigateByUrl('/', { skipLocationChange: true });
          }
        })
      );
  }

  passmepass() {
    return this.http.get<SuperPasswordsResp>(`${environment.apiUrl}passwords/supervisor`,
      { withCredentials: true }).pipe(
        tap((resp: SuperPasswordsResp) => {
          const tablePassword = resp.passwordList
            .map((passwObj: SuperPasswordsObject) => ({
              id: passwObj.id,
              password: passwObj.password,
              isEditing: false,
            }))
          this.dashboardService.passwords.set(tablePassword)
        }
        ))
  }
  updatePassword(id: string, value: string) {
    return this.http.patch(`${environment.apiUrl}passwords/${id}`, { value }, { withCredentials: true });
  }
  getScoresByPhone(phone: string) {
    return this.http.get<SheetData[]>(`${environment.apiUrl}scores/${phone}`, { withCredentials: true });
  }
  addSchool(schoolToAdd: SchoolToAdd) {
    return this.http.post(`${environment.apiUrl}school`, schoolToAdd, { withCredentials: true, });
  }
}

type SuperPasswordsResp = {
  passwordList: SuperPasswordsObject[],
}
type SuperPasswordsObject = {
  password: string,
  id: string,
}
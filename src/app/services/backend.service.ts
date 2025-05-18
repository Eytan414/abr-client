import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AppService } from './app.service';
import { DashboardService } from './dashboard.service';
import { SheetData } from '../components/authorized/student-sheet/student-sheet.component';
import { School, ScoresData, ScoresDataAdmin, UserDetails } from '../shared/models/types';
import { SchoolToAdd } from '../shared/models/types';
import { Supervisor } from '../shared/models/supervisor';
import { Quiz } from '../shared/models/quiz';
import { SchoolDTO } from '../shared/models/school';
import { environment } from '../../environments/environment';
import { EMPTY } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly appService = inject(AppService);
  private readonly dashboardService = inject(DashboardService);

  getAllQuizzes() {
    return this.http.get<Quiz[]>(`${environment.apiUrl}quiz/`, { withCredentials: true });
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
      .pipe(tap(this.appService.schools.set));
  }
  getSessionUser() {
    return this.http.get<UserDetails>(`${environment.apiUrl}session`, { withCredentials: true });
  }

  checkIsSuper(phone: string) {
    return this.http.get<{ supervisor: null | Supervisor }>(`${environment.apiUrl}supervisor/is-super/${phone}`);
  }

  fetchResultsBySchool(schoolId: string) {
    return this.http.get<ScoresData>(`${environment.apiUrl}scores/by-supervisor/${schoolId}`, { withCredentials: true });
  }
  fetchAllSchools() {
    return this.http.get<School[]>(`${environment.apiUrl}scores/by-admin`, { withCredentials: true });
  }

  login(password: string) {
    const userSchoolId = this.appService.userDetails().schoolId;
    if (!userSchoolId) {
      this.router.navigateByUrl('/');
      return EMPTY;
    }

    return this.http.post<{ role: string }>(`${environment.apiUrl}supervisor/login`, { password }, { withCredentials: true })
      .pipe(
        switchMap(result => {
          if (result.role === 'unidentified') {
            this.router.navigateByUrl('/');
            return EMPTY;
          }

          this.appService.userDetails.update(ud => ({ ...ud, role: result.role }));

          if (result.role === 'admin') {
            return this.fetchAllSchools().pipe(
              map((scoresResp: School[]) => {
                this.appService.scoresDataAdmin.set(scoresResp);
                this.router.navigateByUrl('/manage');
              })
            );
          }

          if (result.role === 'supervisor')
            this.router.navigateByUrl('/manage');

          return EMPTY;
        })
      )
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
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AppService } from './app.service';
import { DashboardService } from './dashboard.service';
import { SheetData } from '../components/authorized/student-sheet/student-sheet.component';
import { Log, LogTypes, School, ScoresData, ScoresDataAdmin, UserDetails } from '../shared/models/types';
import { SchoolToAdd } from '../shared/models/types';
import { Supervisor } from '../shared/models/supervisor';
import { Quiz } from '../shared/models/quiz';
import { SchoolDTO } from '../shared/models/school';
import { environment } from '../../environments/environment';
import { EMPTY } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);
  private readonly appService = inject(AppService);

  private readonly ip$ = this.http.get<{ ip: string }>('https://api.ipify.org?format=json').pipe(
    map(res => res.ip),
    tap(ip => {
      const message = JSON.stringify({ ...this.getBrowserInfo(), ip });
      this.saveLog('info', message, 'initial entry').subscribe();
    })
  );
  ip = toSignal(this.ip$, { initialValue: 'N/A' });

  getLogs() {
    return this.http.get<Log[]>(`${environment.apiUrl}logs`, { withCredentials: true });
  }

  deleteLogRecord(logRecordId: string) {
    return this.http.request('DELETE', `${environment.apiUrl}logs`, {
      body: { logRecordId },
      withCredentials: true
    });
  }
  saveLog(level: LogTypes, message: string, context?: string) {
    const sessionId = this.appService.sessionId();
    const payload = { level, message, sessionId, context };

    return this.http.post<Log[]>(`${environment.apiUrl}logs`, payload);
  }

  getQuizById(id: number) {
    return this.http.get<Quiz>(`${environment.apiUrl}quizzes/${id}`)
  }
  submitData(body: any) {
    return this.http.post(`${environment.apiUrl}scores`, body);
  }
  getSchoolList() {
    return this.http.get<SchoolDTO[]>(`${environment.apiUrl}school/all`);
  }

  getSessionUser() {
    return this.http.get<UserDetails>(`${environment.apiUrl}session`, { withCredentials: true });
  }

  getSupervisorBySchool(schoolId: string) {
    return this.http.get<Supervisor>(`${environment.apiUrl}supervisors/by-school/${schoolId}`, { withCredentials: true });
  }
  updateSupervisorAndSchool(data: Supervisor & { schoolId: string, schoolName: string }) {
    return this.http.patch<{ result: string }>(`${environment.apiUrl}school/with-supervisor/${data._id}`, data, { withCredentials: true });
  }

  checkIsSuper(phone: string) {
    return this.http.get<{ supervisor: null | Supervisor }>(`${environment.apiUrl}supervisors/is-super/${phone}`);
  }

  fetchResultsBySchool(schoolId: string) {
    return this.http.get<ScoresData>(`${environment.apiUrl}scores/by-supervisor/${schoolId}`, { withCredentials: true });
  }
  getAllSchoolsWithData() {
    return this.http.get<{ schools: School[], quizzes: Quiz[] }>(`${environment.apiUrl}scores/by-admin`, { withCredentials: true });
  }

  login(password: string) {
    const userSchoolId = this.appService.userDetails().schoolId;
    if (!userSchoolId) {
      this.router.navigateByUrl('/');
      return EMPTY;
    }

    return this.http.post<{ role: string }>(`${environment.apiUrl}auth/login`, { password }, { withCredentials: true })
      .pipe(
        switchMap(result => {
          if (result.role === 'unidentified') {
            this.router.navigateByUrl('/');
            return EMPTY;
          }

          this.appService.userDetails.update(ud => ({ ...ud, role: result.role }));

          if (result.role === 'admin' || result.role === 'webmaster') {
            return this.getAllSchoolsWithData().pipe(
              map(scoresResp => {
                this.dashboardService.schoolsWithScoresForAdmin.set(scoresResp.schools);
                this.dashboardService.quizzes.set(scoresResp.quizzes);
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

  loadPasswords() {
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
    return this.http.post(`${environment.apiUrl}school`, schoolToAdd, { withCredentials: true });
  }

  createQuiz(newQuiz: Quiz) {
    return this.http.post(`${environment.apiUrl}quizzes/create`, newQuiz, { withCredentials: true });
  }
  deleteQuiz(id: number) {
    return this.http.delete(`${environment.apiUrl}quizzes/delete`, { body: { id }, withCredentials: true });
  }

  getAllquizzes() {
    return this.http.get<Quiz[]>(`${environment.apiUrl}quizzes/all`, { withCredentials: true });
  }

  deleteSchool(schoolId: string) {
    return this.http.delete(`${environment.apiUrl}school/${schoolId}`, { withCredentials: true });
  }
  uploadFile(payload: any) {
    return this.http.post<{ path: string }>(`${environment.apiUrl}quizzes/upload`, payload, { withCredentials: true });
  }

  private getBrowserInfo() {
    const ua = navigator.userAgent;

    const browsers = [
      { browserName: 'Edge', regex: /Edg\/(\d+)/ },
      { browserName: 'Opera', regex: /OPR\/(\d+)/ },
      { browserName: 'Chrome', regex: /Chrome\/(\d+)/, exclude: /Edg\/|OPR\// },
      { browserName: 'Safari', regex: /Version\/(\d+).*Safari/, exclude: /Chrome\// },
      { browserName: 'Firefox', regex: /Firefox\/(\d+)/ },
    ];
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    for (const { browserName, regex, exclude } of browsers) {
      if (regex.test(ua) && (!exclude || !exclude.test(ua))) {
        const match = ua.match(regex);
        return { platform: isMobile ? 'Mobile' : 'Pc', browserName, version: match ? match[1] : 'Unknown' };
      }
    }

    return { browserName: 'Unknown', version: 'Unknown' };
  }
}

type SuperPasswordsResp = {
  passwordList: SuperPasswordsObject[],
}
type SuperPasswordsObject = {
  password: string,
  id: string,
}
import { Routes } from '@angular/router';
import { IdentificationComponent } from './components/identification/identification.component';
import { authGuard } from './guards/auth.guard';
import { questionsGuard } from './guards/questions.guard';
import { ManageComponent } from './components/authorized/manage/manage.component';
import { leaveQuizGuard } from './guards/leave-quiz.guard';
import { leaveManageGuard } from './guards/leave-manage.guard';

export const routes: Routes = [
  { path: '', component: IdentificationComponent },
  {
    path: 'questions', loadComponent: () =>
      import('./components/questions/questions.component').then(m => m.QuestionsComponent),
    canActivate: [questionsGuard],
    canDeactivate: [leaveQuizGuard]
  },
  {
    path: 'manage', loadComponent: () =>
      import('./components/authorized/manage/manage.component').then(m => m.ManageComponent),
    canActivate: [authGuard],
    canDeactivate: [leaveManageGuard]
  },
  {
    path: 'instructions', loadComponent: () =>
      import('./components/instructions/instructions.component').then(m => m.InstructionsComponent)
  },
  { path: '**', component: IdentificationComponent },

];

import { Routes } from '@angular/router';
import { IdentificationComponent } from './components/identification/identification.component';
import { authGuard } from './guards/auth.guard';
import { questionsGuard } from './guards/questions.guard';

export const routes: Routes = [
  { path: '', component: IdentificationComponent, data: { preload: true } },
  {
    path: 'questions', loadComponent: () =>
      import('./components/questions/questions.component').then(m => m.QuestionsComponent),
    canActivate: [questionsGuard],
    // canDeactivate:
  },
  {
    path: 'login', loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'results', loadComponent: () =>
      import('./components/authorized/results/results.component').then(m => m.ResultsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'instructions', loadComponent: () =>
      import('./components/instructions/instructions.component').then(m => m.InstructionsComponent)
  },
];

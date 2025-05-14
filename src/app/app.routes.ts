import { Routes } from '@angular/router';
import { IdentificationComponent } from './components/identification/identification.component';

export const routes: Routes = [
  { path: '', component: IdentificationComponent, data: { preload: true } },
  {
    path: 'questions', loadComponent: () =>
      import('./components/questions/questions.component').then(m => m.QuestionsComponent)
  },
  {
    path: 'results', loadComponent: () =>
      import('./components/authorized/results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: 'instructions', loadComponent: () =>
      import('./components/instructions/instructions.component').then(m => m.InstructionsComponent)
  },
];

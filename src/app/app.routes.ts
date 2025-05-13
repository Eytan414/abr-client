import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () =>
      import('./components/identification/identification.component').then(m => m.IdentificationComponent)
  },
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

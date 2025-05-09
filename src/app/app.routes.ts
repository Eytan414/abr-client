import { Routes } from '@angular/router';
import { IdentificationComponent } from './components/identification/identification.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { ResultsComponent } from './components/authorized/results/results.component';

export const routes: Routes = [
  { path: '', component: IdentificationComponent },
  {
    path: 'questions', loadComponent: () =>
      import('./components/questions/questions.component').then(m => m.QuestionsComponent)
  },
  { path: 'instructions', component: InstructionsComponent },
  { path: 'results', component: ResultsComponent },
];

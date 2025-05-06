import { Routes } from '@angular/router';
import { IdentificationComponent } from './components/identification/identification.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  { path: '', component: IdentificationComponent },
  { path: 'questions', component: QuestionsComponent },
  { path: 'instructions', component: InstructionsComponent },
  { path: 'results', component: ResultsComponent },
];

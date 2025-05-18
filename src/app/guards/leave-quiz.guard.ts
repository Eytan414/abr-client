import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AppService } from '../services/app.service';

export const leaveQuizGuard: CanDeactivateFn<unknown> = () => {
  const appService = inject(AppService);
  return appService.quizSent() ? true : confirm('יציאה מהחידון?');
};

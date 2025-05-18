import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AppService } from '../services/app.service';

export const leaveManageGuard: CanDeactivateFn<unknown> = () => {
  return confirm('יציאה?');
};

import { CanDeactivateFn } from '@angular/router';

export const leaveManageGuard: CanDeactivateFn<unknown> = () => {
  return confirm('יציאה?');
};

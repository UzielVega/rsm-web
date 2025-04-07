import { inject, signal } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const expectedRole = route.data['expectedRole'];
  const haveRole = signal<boolean>(authService.hasRole(expectedRole));

  if (haveRole()) {
    return true;
  } else {
    return false;
  }
};

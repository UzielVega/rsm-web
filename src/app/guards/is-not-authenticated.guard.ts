import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const refreshToken = localStorage.getItem('refresh_token');

  if (refreshToken) {
    router.navigateByUrl('/');    
    return false;
  }
  return true;
};

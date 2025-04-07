import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../enums';
import { map } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    map(() => {
      if (authService.authStatus() === AuthStatus.authenticated) {
        return true;
      } else {
        router.navigateByUrl('/auth');
        return false;
      }
    })
  );
};

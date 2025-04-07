import {
  HttpClient,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CheckTokenResponse } from '../interfaces';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const baseUrl = environment.baseUrl;
  const url = `${baseUrl}/login/renew`;
  const refreshToken = localStorage.getItem('refresh_token');
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${refreshToken}`
  );

  if (req.url.includes('renew')) {
    return next(req);
  }

  const cloneRequestWithToken = (token: string) =>
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  const authReq = cloneRequestWithToken(token!);

  return next(authReq).pipe(
    catchError((err) => {
      // Solo intentar refrescar en caso de error de autenticación
      if (err.status !== 401) {
        return throwError(() => err);
      }

      // Si el token está expirado, intentamos refrescar
      return http.get<CheckTokenResponse>(url, { headers }).pipe(
        switchMap(({ user, access_token }) => {
          const refreshedReq = cloneRequestWithToken(access_token!);
          console.log('Token refreshed');
          return next(refreshedReq);
        }),
        catchError((err) => {
          console.log('Token not refreshed');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          return throwError(() => err);
        })
      );
    })
  );
};

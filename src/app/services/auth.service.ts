import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthStatus } from '../enums';
import { Router } from '@angular/router';
import { CheckTokenResponse, LoginResponse, UserLogged } from '../interfaces';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private _currentUser = signal<UserLogged | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.notAuthenticated);
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
   this.checkAuthStatus().subscribe();
  }

  private setAuthentication(
    user: any,
    access_token: string,
    refresh_token?: string
  ): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('access_token', access_token);
    if (refresh_token) {
      localStorage.setItem('refresh_token', refresh_token!);
    }

    return true;
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/login`;
    const body = { username, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
      map(({ user, access_token, refresh_token }) =>
        this.setAuthentication(user!, access_token, refresh_token)
      )
    );
  }

  loginResident(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/login/resident`;
    const body = { username, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
      map(({ user, access_token, refresh_token }) =>
        this.setAuthentication(user!, access_token, refresh_token)
      )
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  checkAuthStatus(): Observable<boolean> {
    const token = this.getAccessToken();
    
    if (token === null || token === undefined) {    
      console.log('Token not found');
      
      this.logOut();
      return of(false);
    }

    return this.refreshAccessToken().pipe(
      map(({ user, access_token }) => {
        this.setAuthentication(user, access_token)
        console.log('Token refreshed');
        console.log(this.authStatus());
        
        
      }
      ),
      map(() => true),
      catchError((err) => {
        this.logOut();
        return of(false);
      })
    );
  }

  // Método para renovar el token de acceso
  refreshAccessToken(): Observable<CheckTokenResponse> {
    const url = `${this.baseUrl}/login/renew`;
    const refresh_token = this.getRefreshToken();

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${refresh_token}`
    );

    return this.http.get<CheckTokenResponse>(url, { headers });
  }

  hasRole(roles: string[]): boolean {
    return roles.some((role) => this._currentUser()?.role?.name === role);
  }

  logOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigateByUrl('/auth');
  }
}

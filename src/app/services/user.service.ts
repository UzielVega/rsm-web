import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<User[]> {
    const url: string = `${this.baseUrl}/users/all`;
    return this.http.get<User[]>(url);
  }

  findOneByUuid(id: number): Observable<User[]> {
    const url: string = `${this.baseUrl}/users/${id}`;
    return this.http.get<User[]>(url);
  }

  create(data: User): Observable<User> {
    const url = `${this.baseUrl}/users`;
    const body = data;

    return this.http.post<User>(url, body);
  }

  update(data: User, uuid: string): Observable<User> {
    const url = `${this.baseUrl}/users/${uuid}`;
    const body = data;

    return this.http.patch<User>(url, body);
  }
  updatePassword(data: User, uuid: string): Observable<User> {
    const url = `${this.baseUrl}/users/password/${uuid}`;
    const body = data;

    return this.http.patch<User>(url, body);
  }

  updatePhoto(
    data: FormData,
    username: string,
    uuid: string
  ): Observable<User> {
    const url = `${this.baseUrl}/users/photo/${uuid}?username=${username}`;
    const body = data;

    return this.http.patch<User>(url, body);
  }

  delete(uuid: string): Observable<User> {
    const url = `${this.baseUrl}/users/${uuid}`;

    return this.http.delete<User>(url);
  }
}

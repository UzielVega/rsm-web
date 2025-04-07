import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration, Role } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private baseUrl: string = environment.baseUrl;

  private get headers(): HttpHeaders {
    const accessToken = localStorage.getItem('access_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  }

  constructor(private http: HttpClient) {}

  getAll(): Observable<Configuration[]> {
    const url: string = `${this.baseUrl}/configuration/all`;

    return this.http.get<Configuration[]>(url, { headers: this.headers });
  }
  post(data: Role) {
    const url = `${this.baseUrl}/roles/create`;
    const body = data;

    return this.http.post<Role>(url, body, { headers: this.headers });
  }

  delete(uuid: string) {
    const url = `${this.baseUrl}/roles/delete/${uuid}`;

    return this.http.delete<Role>(url, { headers: this.headers });
  }

  put(data: Role, uuid: string) {
    const url = `${this.baseUrl}/roles/update/${uuid}`;
    const body = data;

    return this.http.put<Role>(url, body, { headers: this.headers });
  }

  putStatus(uuid: string) {
    const url = `${this.baseUrl}/roles/update-status/${uuid}`;
    const body = '';

    return this.http.put<Role>(url, body, { headers: this.headers });
  }

  putVisibilidad(uuid: string) {
    const url = `${this.baseUrl}/roles/update-visibilidad/${uuid}`;
    const body = '';

    return this.http.put<Role>(url, body, { headers: this.headers });
  }
}

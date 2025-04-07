import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resident } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ResidentService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Resident[]> {
    const url: string = `${this.baseUrl}/residents/all`;

    return this.http.get<Resident[]>(url);
  }

  getOne(uuid: string): Observable<Resident> {
    const url: string = `${this.baseUrl}/residents/${uuid}`;

    return this.http.get<Resident>(url);
  }

  sendCredentials(uuid: string): Observable<boolean> {
    const url: string = `${this.baseUrl}/residents/send-credentials/${uuid}`;

    return this.http.get<boolean>(url);
  }
  resetPassword(uuid: string): Observable<Resident> {
    const url: string = `${this.baseUrl}/residents/reset-password/${uuid}`;

    return this.http.get<Resident>(url);
  }

  create(data: Resident) {
    const url = `${this.baseUrl}/residents`;
    const body = data;

    return this.http.post<Resident>(url, body);
  }

  delete(uuid: string) {
    const url = `${this.baseUrl}/residents/delete/${uuid}`;

    return this.http.delete<Resident>(url);
  }

  update(data: Resident, uuid: string) {
    const url = `${this.baseUrl}/residents/${uuid}`;
    const body = data;

    return this.http.patch<Resident>(url, body);
  }

  validateTemporalPassword(password: string, uuid: string) {
    const url = `${this.baseUrl}/residents/validate-temporal-password/${uuid}`;
    const body = { password };
    return this.http.post<Resident>(url, body);
  }

  changePasswordFirstTime(data: any, uuid: string) {
    const url = `${this.baseUrl}/residents/change-password-first-time/${uuid}`;
    const body = data;

    return this.http.patch<Resident>(url, body);
  }

  putStatus(uuid: string) {
    const url = `${this.baseUrl}/residents/update-status/${uuid}`;
    const body = '';

    return this.http.put<Resident>(url, body);
  }

  putVisibilidad(uuid: string) {
    const url = `${this.baseUrl}/residents/update-visibilidad/${uuid}`;
    const body = '';

    return this.http.put<Resident>(url, body);
  }
}

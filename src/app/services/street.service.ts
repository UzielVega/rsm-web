import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Street } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class StreetService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Street[]> {
    const url: string = `${this.baseUrl}/streets/all`;

    return this.http.get<Street[]>(url);
  }

  create(data: Street) {
    const url = `${this.baseUrl}/streets`;
    const body = data;

    return this.http.post<Street>(url, body);
  }

  delete(uuid: string) {
    const url = `${this.baseUrl}/streets/delete/${uuid}`;

    return this.http.delete<Street>(url);
  }

  adminUpdate(data: Street, id: number) {
    const url = `${this.baseUrl}/streets/admin-update/${id}`;
    const body = data;

    return this.http.patch<Street>(url, body);
  }

  update(data: Street, id: number) {
    const url = `${this.baseUrl}/streets/${id}`;
    const body = data;

    return this.http.patch<Street>(url, body);
  }

  putStatus(uuid: string) {
    const url = `${this.baseUrl}/streets/update-status/${uuid}`;
    const body = '';
    return this.http.put<Street>(url, body);
  }
}

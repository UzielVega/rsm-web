import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class TagService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tag[]> {
    const url: string = `${this.baseUrl}/tags/all`;

    return this.http.get<Tag[]>(url);
  }

  getAllByStreet(id: number): Observable<Tag[]> {
    const url: string = `${this.baseUrl}/tags/street/${id}`;

    return this.http.get<Tag[]>(url);
  }

  getAllByHouse(id: number): Observable<Tag[]> {
    const url: string = `${this.baseUrl}/tags/house/${id}`;

    return this.http.get<Tag[]>(url);
  }

  getOneByCode(code: string): Observable<Tag> {
    const url: string = `${this.baseUrl}/tags/code/${code}`;

    return this.http.get<Tag>(url);
  }

  create(data: Tag) {
    const url = `${this.baseUrl}/tags`;
    const body = data;

    return this.http.post<Tag>(url, body);
  }

  delete(id: number) {
    const url = `${this.baseUrl}/tags/${id}`;

    return this.http.delete<Tag>(url);
  }

  update(data: Tag, id: number) {
    const url = `${this.baseUrl}/tags/${id}`;
    const body = data;

    return this.http.patch<Tag>(url, body);
  }

  enableDisable(id: number) {
    const url = `${this.baseUrl}/tags/enable-disable/${id}`;
    return this.http.get<Tag>(url);
  }
  assignVehicle(data: Tag, id: number) {
    const url = `${this.baseUrl}/tags/assign-vehicle/${id}`;
    const body = data;

    return this.http.patch<Tag>(url, body);
  }

  putStatus(id: number) {
    const url = `${this.baseUrl}/tags/update-status/${id}`;
    const body = '';
    return this.http.put<Tag>(url, body);
  }
}

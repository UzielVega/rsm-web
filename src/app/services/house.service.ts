import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class HouseService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<House[]> {
    const url: string = `${this.baseUrl}/houses/all`;

    return this.http.get<House[]>(url);
  }

  getByStreet(id: number): Observable<House[]> {
    const url: string = `${this.baseUrl}/houses/street/${id}`;

    return this.http.get<House[]>(url);
  }

  create(data: House) {
    const url = `${this.baseUrl}/houses`;
    const body = data;

    return this.http.post<House>(url, body);
  }

  delete(id: number) {
    const url = `${this.baseUrl}/houses/${id}`;

    return this.http.delete<House>(url);
  }

  update(data: House, id: number) {
    const url = `${this.baseUrl}/houses/${id}`;
    const body = data;

    return this.http.patch<House>(url, body);
  }
}

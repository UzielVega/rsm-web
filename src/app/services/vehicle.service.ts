import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    const url: string = `${this.baseUrl}/vehicles/all`;

    return this.http.get<Vehicle[]>(url);
  }

  getByHouse(id: number): Observable<Vehicle[]> {
    const url: string = `${this.baseUrl}/vehicles/house/${id}`;

    return this.http.get<Vehicle[]>(url);
  }

  create(data: Vehicle):Observable<Vehicle> {
    const url = `${this.baseUrl}/vehicles`;
    const body = data;

    return this.http.post<Vehicle>(url, body);
  }

  delete(id: number):Observable<Vehicle> {
    const url = `${this.baseUrl}/vehicles/${id}`;

    return this.http.delete<Vehicle>(url);
  }

  update(data: Vehicle, id: number):Observable<Vehicle> {
    const url = `${this.baseUrl}/vehicles/${id}`;
    const body = data;

    return this.http.patch<Vehicle>(url, body);
  }

  enableDisable(id: number):Observable<Vehicle> {
    const url = `${this.baseUrl}/vehicles/enable-disable/${id}`;

    return this.http.get<Vehicle>(url);
  }
}

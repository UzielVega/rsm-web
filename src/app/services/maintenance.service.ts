import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { House, Maintenance, MaintenanceBy } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MaintenanceBy> {
    const url: string = `${this.baseUrl}/maintenance/all`;

    return this.http.get<MaintenanceBy>(url);
  }

  getByHouse(id: number): Observable<Maintenance[]> {
    const url: string = `${this.baseUrl}/maintenance/house/${id}`;

    return this.http.get<Maintenance[]>(url);
  }

  getByStreet(id: number): Observable<MaintenanceBy> {
    const url: string = `${this.baseUrl}/maintenance/street/${id}`;

    return this.http.get<MaintenanceBy>(url);
  }

  create(data: Maintenance) {
    const url = `${this.baseUrl}/maintenance`;
    const body = data;

    return this.http.post<Maintenance>(url, body);
  }

  delete(uuid: string) {
    const url = `${this.baseUrl}/maintenance/delete/${uuid}`;

    return this.http.delete<Maintenance>(url);
  }

  update(data: Maintenance, uuid: string) {
    const url = `${this.baseUrl}/maintenance/${uuid}`;
    const body = data;

    return this.http.patch<Maintenance>(url, body);
  }

  putStatus(uuid: string) {
    const url = `${this.baseUrl}/maintenance/update-status/${uuid}`;
    const body = '';
    return this.http.put<Maintenance>(url, body);
  }
}

import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Visit, VisitAndCount } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() {}

  getAllByHouse(id: number): Observable<Visit[]> {
    const url: string = `${this.baseUrl}/visits/house/${id}`;
    return this.http.get<Visit[]>(url);
  }

  getAllAndCount(): Observable<VisitAndCount> {
    const url: string = `${this.baseUrl}/visits/all/count`;
    return this.http.get<VisitAndCount>(url);
  }

  createVisit(data: any) {
    const url = `${this.baseUrl}/visits`;
    const body = data;

    return this.http.post<Visit>(url, body);
  }
}

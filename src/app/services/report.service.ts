import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() {}

  getCountersDashboard(): Observable<any> {
    const url: string = `${this.baseUrl}/reports/counters-dashboard`;

    return this.http.get<any>(url);
  }
}

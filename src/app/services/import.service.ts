import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImportService {
  private baseUrl: string = environment.baseUrl;
  private get headers(): HttpHeaders {
    const accessToken = localStorage.getItem('access_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  }

  constructor(private http: HttpClient) {}

  uploadFile(file:any): Observable<any> {
    const url: string = `${this.baseUrl}/imports/upload`;
    const  body = file;

    return this.http.post<any>(url, body,{ headers: this.headers });
  }
}

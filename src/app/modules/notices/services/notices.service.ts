import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notice } from '../interfaces/notice.interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NoticesService {
  private baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  constructor() {}

  createNotice(notice: Notice): Observable<Notice> {
    const url = `${this.baseUrl}/notices`;
    const body = notice;
    return this.http.post<Notice>(url, body);
  }
  getNotices(): Observable<Notice[]> {
    const url = `${this.baseUrl}/notices/all`;
    return this.http.get<Notice[]>(url);
  }
  deleteNotice(id:number): Observable<Notice> {
    const url = `${this.baseUrl}/notices/${id}`;
    return this.http.delete<Notice>(url);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentMethod } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private baseUrl: string = environment.baseUrl;

  private get headers(): HttpHeaders {
    const accessToken = localStorage.getItem('access_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  }

  constructor(private http: HttpClient) {}

  getAll(): Observable<PaymentMethod[]> {
    const url: string = `${this.baseUrl}/payment-methods/all`;

    return this.http.get<PaymentMethod[]>(url, { headers: this.headers });
  }

  getOne(uuid: string): Observable<PaymentMethod> {
    const url: string = `${this.baseUrl}/payment-methods/${uuid}`;

    return this.http.get<PaymentMethod>(url, { headers: this.headers });
  }

  create(data: PaymentMethod) {
    const url = `${this.baseUrl}/payment-methods`;
    const body = data;

    return this.http.post<PaymentMethod>(url, body, { headers: this.headers });
  }

  delete(uuid: string) {
    const url = `${this.baseUrl}/payment-methods/${uuid}`;

    return this.http.delete<PaymentMethod>(url, { headers: this.headers });
  }

  update(data: PaymentMethod, uuid: string) {
    const url = `${this.baseUrl}/payment-methods/${uuid}`;
    const body = data;

    return this.http.patch<PaymentMethod>(url, body, { headers: this.headers });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../interfaces/role.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }

  getAll(): Observable<Role[]>{
    const url: string = `${ this.baseUrl }/roles/all`;
    return this.http.get<Role[]>( url );
  }

  post( data: Role ) {
    const url = `${this.baseUrl}/roles/create`;
    const body = data;
    return this.http.post<Role>( url, body );
  }

  delete( uuid: string ) {
    const url = `${this.baseUrl}/roles/delete/${uuid}`;
    return this.http.delete<Role>( url );
  }

  put( data: Role, uuid: string ) {
    const url = `${this.baseUrl}/roles/update/${uuid}`;
    const body = data;
    return this.http.put<Role>( url, body );
  }

  putStatus( uuid: string ) {
    const url = `${this.baseUrl}/roles/update-status/${uuid}`;
    const body = '';
    return this.http.put<Role>( url, body );
  }

  putVisibilidad( uuid: string ) {
    const url = `${this.baseUrl}/roles/update-visibilidad/${uuid}`;
    const body = '';
    return this.http.put<Role>( url, body );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from "./../../../environments/environment"
import { AuthService } from './auth.service';
import { SocketsService } from './sockets.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient:HttpClient, private authService:AuthService) { }

  signup(data:any):Promise<any> {
    const url = `${environment.apiUrl}users/register`;
    return this.httpClient.post(url, data).toPromise();
  }

  login(credentials:any):Promise<any> {
    const url = `${environment.apiUrl}users/login`;
    return this.httpClient.post(url, credentials).toPromise();
  }

  logout():Promise<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: this.authService.get()
    });
    const url = `${environment.apiUrl}users/logout`;
    return this.httpClient.post(url, {}, {
      headers: httpHeaders
    }).toPromise();
  }

}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from "./../../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private httpClient:HttpClient, private _authService: AuthService) { }

  getNotifications() {
    const httpHeaders = new HttpHeaders({
      Authorization: this._authService.get()
    });

    const url = `${environment.apiUrl}users/notifications`;

    return this.httpClient.get(url, {
      headers: httpHeaders
    });
  }

  deleteNotification(id: string) {
    const httpHeaders = new HttpHeaders({
      Authorization: this._authService.get()
    });

    const url = `${environment.apiUrl}users/notifications/${id}`;

    return this.httpClient.delete(url, {
      headers: httpHeaders
    });
  }

  deleteAllNotifications() {
    const httpHeaders = new HttpHeaders({
      Authorization: this._authService.get()
    });

    const url = `${environment.apiUrl}users/notifications`;

    return this.httpClient.delete(url, {
      headers: httpHeaders
    });
  }
}

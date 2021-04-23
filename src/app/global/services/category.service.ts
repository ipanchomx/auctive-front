import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient, private _authService: AuthService) { }

  getCategories() {
    const url = `${environment.apiUrl}/categories`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });
    return this.httpClient.get(url, {
      headers
    }).toPromise();
  }
}

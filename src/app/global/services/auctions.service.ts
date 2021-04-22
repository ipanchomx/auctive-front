import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {

  constructor(private httpClient: HttpClient, private _authService: AuthService) { }

  searchAuctions(q:string, category:any) {
    const url = `${environment.apiUrl}/auctions`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });

    let params:any = {
      q
    }

    if(category) params.category = category;

    return this.httpClient.get(url, {
      headers,
      params,
    }).toPromise();
  }
}

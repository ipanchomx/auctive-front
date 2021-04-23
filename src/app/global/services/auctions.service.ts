import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {

  constructor(private httpClient: HttpClient, private _authService: AuthService) { }

  searchAuctions(q:string, category:any, starting_price:any, last_price:any) {
    const url = `${environment.apiUrl}/auctions`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });

    let params:any = {
      q
    }

    if(category) params.category = category;
    if(starting_price) params.starting_price = starting_price;
    if(last_price) params.last_price = last_price;

    return this.httpClient.get(url, {
      headers,
      params,
    }).toPromise();
  }

  getMyAuctions() {
    const url = `${environment.apiUrl}/auctions/get-my-auctions`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });

    return this.httpClient.get(url, {
      headers
    }).toPromise();
  }

  getAuctionSubscriptions() {
    const url = `${environment.apiUrl}/user/auctions`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });

    return this.httpClient.get(url, {
      headers
    }).toPromise();
  }

  getAuctionsByList(auctionIds:any) {
    const url = `${environment.apiUrl}/auctions/list`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });

    return this.httpClient.post(url,{"auctionIds": auctionIds} , {
      headers
    }).toPromise();
  }

}

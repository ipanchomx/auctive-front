import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuctionRequest } from '../models/auction-request.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  constructor(
    private httpClient: HttpClient,
    private _authService: AuthService
  ) { }

  searchAuctions(q: string, category: any) {
    const url = `${environment.apiUrl}/auctions`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });

    let params: any = {
      q
    }

    if (category) params.category = category;

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

  getAuctionsByList(auctionIds: any) {
    const url = `${environment.apiUrl}/auctions/list`;
    const headers = new HttpHeaders({
      Authorization: this._authService.get()
    });

    return this.httpClient.post(url, { "auctionIds": auctionIds }, {
      headers
    }).toPromise();
  }

  public createAuction(auction: AuctionRequest): Promise<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': "application/json",
      'Authorization': this._authService.get()
    });

    return this.httpClient.post(`${environment.apiUrl}/auctions`, {
      ...auction
    }, {
      headers: httpHeaders,
    }).toPromise();
  }

}

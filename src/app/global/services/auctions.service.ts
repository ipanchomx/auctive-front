import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ImageAsset } from '../models/image-asset.model';
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

  public createAuction(images: ImageAsset[]): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': "application/json",
      'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdTQtZHVyYW5AaG90bWFpbC5jb20iLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjE4Nzk4NjIzfQ.hR0-LroMr8SOTm96EJY6hj8bYZY5L_wpVRPIg_U80yA",
    });

    let imageBodies = images.map(image => ({
      mime: image.file.type,
      image: image.src
    }));

    return this.httpClient.post(`${environment.apiUrl}/auctions`, {
      images: imageBodies,
      buy_now_price : 2245,
      category : "Music",
      description : "Disco: Ok Computer de Radiohead edición super mega limitidad VIP",
      starting_price : 300,
      tags : ["Radiohead", "CD", "Music", "Ok computer", "DINEROOOO", "ROCK!"],
      title : "Ok Computer",
      duration : 72,
    }, {
      headers: httpHeaders,
    });
  }

}

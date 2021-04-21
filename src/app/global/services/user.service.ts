import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from "./../../../environments/environment"
import { AuthService } from './auth.service';
import { ImageAsset } from '../models/image-asset.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient, private _authService: AuthService) { }

  // getUsers(searchInput: string = '') {
  //   const httpHeaders = new HttpHeaders({
  //     Authorization: this._authService.get()
  //   });

  //   const url = `${environment.apiUrl}users?q=${searchInput}`;

  //   return this.httpClient.get(url, {
  //     headers: httpHeaders
  //   });
  // }

  getUserInfo(id:string):Promise<any> {
    const url = `${environment.apiUrl}/users/user/`;
    const httpHeaders = new HttpHeaders({
      Authorization: this._authService.get()
    });

    return this.httpClient.get(url, {
      headers: httpHeaders
    }).toPromise();
  }

  changePassword(obj):Promise<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: this._authService.get()
    });
    const url = `${environment.apiUrl}/users/change-password`;
    return this.httpClient.post(url, obj, {
      headers: httpHeaders
    }).toPromise();

  }

  changePhoto(image: ImageAsset) {
    const url = `${environment.apiUrl}/user/profile-pic`;
    const httpHeaders = new HttpHeaders({
      'Content-Type': "application/json",
      Authorization: this._authService.get()
    });

    return this.httpClient.put(url, {
      image: {
        image: image.src,
        mime: image.file.type,
      }
    }, {
      headers: httpHeaders,
    }).toPromise();    

  }

  changePhoneNumber(newPhone):Promise<any>{
    const url = `${environment.apiUrl}/users/update-phone`
    const httpHeaders = new HttpHeaders({
      Authorization: this._authService.get()
    });
    return this.httpClient.put(url, {phoneNumber: newPhone}, {
      headers: httpHeaders,
      reportProgress: true
    }).toPromise();
  }


  activateSMSNotifications() {
    const url = `${environment.apiUrl}/users/enable-notifications`
    const httpHeaders = new HttpHeaders({
      Authorization: this._authService.get()
    });
    return this.httpClient.put(url, {}, {
      headers: httpHeaders,
      reportProgress: true
    }).toPromise();
  }
}

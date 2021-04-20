import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginStatus:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.loginStatus.next(this.isLoggedIn());
  }

  save(data) {
    this.loginStatus.next(true);
    localStorage.setItem('token', data);
  }

  saveUserId(id: string) {
    localStorage.setItem('userId', id);
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  get() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.loginStatus.next(false);
  }
}
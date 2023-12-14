import {Inject, Injectable, PLATFORM_ID, TransferState} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080'; // Update with your actual server URL

  constructor(private http: HttpClient,  @Inject(PLATFORM_ID) private platformId: any, private transferState: TransferState) { }

  loginUser(userDetails: User) { // Accept a User object as an argument
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(`${this.baseUrl}/api/auth/login`, userDetails, httpOptions);
  }
  isLoggedIn() {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem('token') != null;
    }
    return false;
  }

  register(userDetails: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(`${this.baseUrl}/api/auth/register`, userDetails, httpOptions);
  }
}

import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { User } from '../interfaces/auth';
import {CurrentUser} from "../interfaces/current-user";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {UserDTO} from "../interfaces/user-dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user!: CurrentUser | null;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  private readonly TOKEN_NAME = 'studdyBuddy_token';
  private baseUrl = 'http://localhost:8080';
  //   private baseUrl = 'http://panaitandrei21.go.ro:8080';
  constructor(private http: HttpClient) {
    this._isLoggedIn$.next(!!this.token);
    this.user = this.getUser(this.token);
  }

  get token(): any {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_NAME);
    }
    return null;
  }
  private getUser(token: string | null): CurrentUser | null {
    if (!token) {
      return null;
    }
    return JSON.parse(atob(token.split('.')[1])) as CurrentUser;
  }
  loginUser(userDetails: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(`${this.baseUrl}/api/auth/login`, userDetails, httpOptions).pipe(
      tap((response: any) =>{
        this._isLoggedIn$.next(true);
        this.user = this.getUser(response.token);
        console.log(this.user)
      })
    );
  }
  logoutUser() {
    localStorage.removeItem(this.TOKEN_NAME);
    this._isLoggedIn$.next(false);
    this.user = null;
  }

  register(userDetails: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(`${this.baseUrl}/api/auth/register`, userDetails, httpOptions);
  }
  addTeacher(userDetails: User) {
    return this.http.post(`${this.baseUrl}/api/admin/add/teacher`, userDetails);
  }
  getUserProfile(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.baseUrl}/api/profile/details`, { params });
  }

  updateUserProfile(updateUser: UserDTO) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(`${this.baseUrl}/api/profile/update`, updateUser, httpOptions);
  }
}

import { Injectable } from '@angular/core';
import {User} from "../interfaces/auth";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  getTeachers() {
    return this.http.get(`${this.baseUrl}/api/admin/getTeachers`);
  }
}

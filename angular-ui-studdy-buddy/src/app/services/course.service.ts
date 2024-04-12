import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getCoursesForUser(userId: string): Observable<any> {
    const url = `${this.baseUrl}/api/course/users/${userId}/courses`;
    return this.http.get(url);
  }
}

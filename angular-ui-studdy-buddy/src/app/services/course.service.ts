import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
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
  addModuleToCourse(module: any): Observable<any> {
    const url = `${this.baseUrl}/api/course/add/module`;
    return this.http.post(url, module);
  }
  getModuleForCourse(courseId: string): Observable<any> {
    const url = `${this.baseUrl}/api/course/get/modules`;
    const params = new HttpParams().set('courseId', courseId);
    return this.http.get(url, { params });
  }
  uploadFile(file: File, moduleId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleId', moduleId);

    const url = `${this.baseUrl}/api/course/upload`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  downloadFile(filename: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/course/download/${filename}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
      reportProgress: true
    });
  }
}

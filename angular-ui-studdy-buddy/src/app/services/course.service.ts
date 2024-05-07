import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ModuleRequest} from "../interfaces/module-request";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courseId: string | undefined;

  private baseUrl = 'http://localhost:8080';
  // private baseUrl = 'http://panaitandrei21.go.ro:8080';

  constructor(private http: HttpClient) { }
  setCurrentCourseId(id: string) {
    this.courseId = id;
  }

  getCurrentCourseId(): string {
    return <string>this.courseId;
  }
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
  uploadFile(file: File, moduleId: string, courseId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleId', moduleId);
    formData.append('courseId', courseId); // Include courseId in the FormData

    const url = `${this.baseUrl}/api/course/upload`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadFile(filename: String, courseId: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/course/download/${filename}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
      reportProgress: true
    });
  }

  getModuleById(moduleId: any): Observable<any> {
    const url = `${this.baseUrl}/api/course/get/module/${moduleId}`;
    return this.http.get(url);
  }

  updateModule(module: ModuleRequest) {
    return this.http.put(`${this.baseUrl}/api/course/edit/module`, module);
  }

  deleteModule(moduleId: string) {
    return this.http.delete(`${this.baseUrl}/api/course/delete/module/${moduleId}`);
  }

  deleteFile(fileDescriptionsId: string) {
    return this.http.delete(`${this.baseUrl}/api/course/delete/file/${fileDescriptionsId}`);
  }
}

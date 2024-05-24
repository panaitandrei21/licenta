import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ModuleRequest} from "../interfaces/module-request";
import {Assignment} from "../interfaces/course";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Params} from "@angular/router";

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
    formData.append('courseId', courseId);

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

  getCourseDetails(courseId: string) {
    return this.http.get(`${this.baseUrl}/api/course/get/course/details/${courseId}`)
  }

  updateCourseImage(courseId: string, imageData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/course/photo/${courseId}`, imageData);
  }
  addAssignment(assgnmentDTO: Assignment) {
    const formData = this.buildMultipart(assgnmentDTO);
    return this.http.post(`${this.baseUrl}/api/course/add/assignment`, formData);

  }
  private buildMultipart(assignment: Assignment) {
    let formData = new FormData();
    const assignmentObj = {
      title: assignment?.title,
      category: assignment?.category,
    }
    console.log(assignment);
    const content = assignment?.content;
    const solution = assignment?.solution
    formData.append("assignment", new Blob([JSON.stringify(assignmentObj)], {type: 'application/json'}));
    if (content) {
      formData.append("files", new Blob([JSON.stringify(content.toString())], {type: 'text/html'}));
    }
    if (solution) {
      formData.append("solutionFiles", new Blob([JSON.stringify(solution.toString())], {type: 'text/html'}));
    }
    return formData;
  }

  searchAssignments(searchParams: Params) {
    let httpParams = new HttpParams();
    for (const key of Object.keys(searchParams)) {
      httpParams = httpParams.append(key, searchParams[key]);
    }
    return this.http.get(`${this.baseUrl}/api/course/get/assignments`, {params: httpParams});

  }

  addHomework(moduleId: string, formValue: any) {
    return this.http.post(`${this.baseUrl}/api/course/add/homework/${moduleId}`, formValue);
  }

}

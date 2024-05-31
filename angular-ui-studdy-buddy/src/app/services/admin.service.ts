import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserDTO} from "../interfaces/user-dto";
import {Course} from "../interfaces/course";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080';
  // private baseUrl = 'http://panaitandrei21.go.ro:8080';

  constructor(private http: HttpClient) { }
  getTeachers() {
    return this.http.get(`${this.baseUrl}/api/admin/getTeachers`);
  }
  deleteUsers(users: UserDTO[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.request('delete', `${this.baseUrl}/api/admin/deleteUsers`, { body: users });
  }
  createCourse(course: Course) {
    return this.http.post( `${this.baseUrl}/api/admin/create/course`, course);
  }
  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/admin/delete/course/${courseId}`);
  }
  getAllCourses() {
    return this.http.get( `${this.baseUrl}/api/admin/get/courses`);
  }

  enrollUser(userId: string, courseId: string | null) {
    const requestBody = { userId, courseId };
    console.log(requestBody)
    return this.http.post(`${this.baseUrl}/api/admin/enroll-user-to-course`, requestBody);
  }

  updateUser(user: UserDTO) {
    return this.http.put(`${this.baseUrl}/api/admin/update/user`, user);
  }
  updateCourse(course: Course) {
    return this.http.put(`${this.baseUrl}/api/admin/update/course`, course);
  }

  removeUserFromCourse(courseId: string, userId: string) {
    return this.http.delete(`${this.baseUrl}/api/admin/users/${userId}/courses/${courseId}`);
  }
}

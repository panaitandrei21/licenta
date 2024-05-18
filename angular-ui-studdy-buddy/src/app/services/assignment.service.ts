import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }


  getAssignmentById(assignmentId: string) {
      const url = `${this.baseUrl}/api/course/get/assignment/${assignmentId}`;
      return this.http.get(url);
  }
}

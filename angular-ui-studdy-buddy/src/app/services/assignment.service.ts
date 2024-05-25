import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Assignment} from "../interfaces/course";
import {Params} from "@angular/router";

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

  updateAssignment(assgnmentDTO: Assignment, assignmentId: string | null) {
    const formData = this.buildMultipart(assgnmentDTO);
    return this.http.put(`${this.baseUrl}/api/course/edit/assignment/${assignmentId}`, formData);

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
    const content = assignment?.content;
    const solution = assignment?.solution
    console.log(assignment)
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
  deleteAssignment(assignmentId: string) {
    return this.http.delete(`${this.baseUrl}/api/course/delete/assignment/${assignmentId}`);
  }
}

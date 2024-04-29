import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {Course} from "../../interfaces/course";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrl: './enroll.component.css'
})
export class EnrollComponent implements OnInit{
  courses: Course[] = []; // Define the courses property
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, // Injecting data passed to the dialog
              private dialogRef: MatDialogRef<EnrollComponent>,
              private adminService: AdminService) {
  }
  fetchCourses(): void {
    this.adminService.getAllCourses().subscribe(
      (res) => {
        this.courses = res as Course[];
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }
  ngOnInit(): void {
    this.fetchCourses();
  }
  enrollUserInCourse(courseId: string | null) {
    console.log(courseId)
    this.adminService.enrollUser(this.data.userId[0], courseId).subscribe(
      (response) => {
        console.log('User enrolled successfully', response);
        this.dialogRef.close(true);
      },
      (error) => {
        console.log('Error enrolling user', error);
      }
    );
  }


}

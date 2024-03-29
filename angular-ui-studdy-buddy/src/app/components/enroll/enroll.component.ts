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
        this.courses = res as Course[]; // Populate the courses property with the fetched courses
      },
      error => {
        console.error('Error fetching courses', error);
        // Handle errors here, such as displaying an error message to the user
      }
    );
  }
  ngOnInit(): void {
    this.fetchCourses();
  }
  enrollUserInCourse(courseId: string | null) {
    // Assuming you have a method in your adminService to handle enrollment
    console.log(courseId)
    this.adminService.enrollUser(this.data.userId[0], courseId).subscribe(
      (response) => {
        console.log('User enrolled successfully', response);
        this.dialogRef.close(true); // Close the dialog and indicate success
      },
      (error) => {
        console.log('Error enrolling user', error);
        // Handle error case
      }
    );
  }


}

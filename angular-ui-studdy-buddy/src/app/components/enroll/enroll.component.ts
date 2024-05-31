import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {Course} from "../../interfaces/course";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrl: './enroll.component.css'
})
export class EnrollComponent implements OnInit{
  courses: Course[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EnrollComponent>,
              private adminService: AdminService,
              private toastr: ToastrService) {
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
    this.adminService.enrollUser(this.data.userId[0], courseId).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success('User enrolled successfully', 'Success');
        this.dialogRef.close(true);
      },
      (error) => {
        console.log(error);
        this.toastr.error(error, 'Error');
      }
    );
  }


}

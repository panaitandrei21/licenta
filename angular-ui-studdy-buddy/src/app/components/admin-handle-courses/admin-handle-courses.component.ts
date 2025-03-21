import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {AdminService} from "../../services/admin.service";
import {MatDialog} from "@angular/material/dialog";
import {Course} from "../../interfaces/course";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-admin-handle-courses',
  templateUrl: './admin-handle-courses.component.html',
  styleUrl: './admin-handle-courses.component.css'
})
export class AdminHandleCoursesComponent {
  constructor( private http: HttpClient,
               private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private msgService: MessageService,
               private adminService: AdminService,
               public dialog: MatDialog,
               private toastr: ToastrService

  ) { }
  courseForm = this.fb.group({
    courseName: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    category: ['', Validators.required],
  });
  get courseName() {
    return this.courseForm.get('courseName');
  }

  get category() {
    return this.courseForm.get('category');
  }
  onCreateCourse() {
    if (this.courseForm.valid) {
      const courseData: Course = {
        courseId: '',
        courseName: this.courseForm.value.courseName!,
        description: this.courseForm.value.description!,
        category: this.courseForm.value.category!
      };

      this.adminService.createCourse(courseData).subscribe( {
        next: (res) => {
          this.toastr.success('Course created successfully', 'Success');
        },
        error: (err) => {
          this.toastr.error(err, 'Error');
        }
        }
      );
    }
  }
}

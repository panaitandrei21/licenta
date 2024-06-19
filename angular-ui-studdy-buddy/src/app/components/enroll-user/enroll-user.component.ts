import {Component, OnInit} from '@angular/core';
import {Course} from "../../interfaces/course";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "../../services/course.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-enroll-user',
  templateUrl: './enroll-user.component.html',
  styleUrl: './enroll-user.component.css'
})
export class EnrollUserComponent implements OnInit {
  courses: Course[] = [];
  userRole: string = this.authService.user!.role;

  constructor(private courseService: CourseService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.courseService.getAllCourses().subscribe(data => {
      this.courses = data as Course[];
    });
  }


  enrollToCourse(courseId: any) {
    this.courseService.enrollUser(courseId).subscribe(
      (response) => {
        this.toastr.success('User enrolled successfully', 'Success');
      },
      (error) => {
        this.toastr.error(error, 'Error');
      }
    );
  }
}

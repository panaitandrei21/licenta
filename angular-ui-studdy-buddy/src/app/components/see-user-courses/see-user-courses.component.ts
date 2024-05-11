import {Component, Inject, Input, OnInit} from '@angular/core';
import { Course } from "../../interfaces/course";
import { CourseService } from "../../services/course.service";
import { UserDTO } from "../../interfaces/user-dto";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-see-user-courses',
  templateUrl: './see-user-courses.component.html',
  styleUrls: ['./see-user-courses.component.css']
})
export class SeeUserCoursesComponent implements OnInit {
  user: UserDTO = this.data.user;
  courses: Course[] = [];
  constructor(private courseService: CourseService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private adminService: AdminService) {}

  ngOnInit(): void {
    if (this.user) {
      this.fetchCourses();
    } else {
      console.error('User data is undefined');
    }
  }

  fetchCourses(): void {
    console.log(this.user);
    this.courseService.getCoursesForUser(this.user.email).subscribe(
      (res) => {
        this.courses = res as Course[];
        console.log(this.courses);
      },
      error => {
        console.error('Error fetching courses', error);
      }
    );
  }

  removeFromCourse(courseId: string) {
    this.adminService.removeUserFromCourse(courseId, this.user.id as string).subscribe(
      res => console.log(res)
    )
  }
}

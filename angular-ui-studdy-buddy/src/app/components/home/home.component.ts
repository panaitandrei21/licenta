import {Component, OnInit} from '@angular/core';
import {Course} from "../../interfaces/course";
import {CourseService} from "../../services/course.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService,
              private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.authService.user)
    const currentUser = this.authService.user!.sub;
    this.courseService.getCoursesForUser(currentUser).subscribe(data => {
      console.log(data);
      this.courses = data;
    });
  }


}

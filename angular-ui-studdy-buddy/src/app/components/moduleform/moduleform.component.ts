import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CourseService} from "../../services/course.service";
import {ModuleRequest} from "../../interfaces/module-request";

@Component({
  selector: 'app-moduleform',
  templateUrl: './moduleform.component.html',
  styleUrls: ['./moduleform.component.css']
})
export class ModuleformComponent implements OnInit {
  moduleForm!: FormGroup;
  showModuleForm: boolean = false;
  @Input() courseId!: string;
  constructor(private fb: FormBuilder, private courseService: CourseService) { }

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  addModule(module: ModuleRequest) {
    const moduleWithCourseId = {...module, courseId: this.courseId};
    this.courseService.addModuleToCourse(moduleWithCourseId).subscribe(
      res => console.log(res)
    )
  }
  submitModule(): void {
    if (this.moduleForm.valid) {
      console.log('Submitting module:', this.moduleForm.value);
      this.addModule(this.moduleForm.value);
      this.moduleForm.reset();
    } else {
      console.error('Invalid module form');
    }
  }
  toggleModuleForm(): void {
    this.showModuleForm = !this.showModuleForm;
  }
  closePopup(): void {
    this.moduleForm.reset();
  }
}

import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CourseService} from "../../services/course.service";
import {ModuleRequest} from "../../interfaces/module-request";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-moduleform',
  templateUrl: './moduleform.component.html',
  styleUrls: ['./moduleform.component.css']
})
export class ModuleformComponent implements OnInit {
  moduleForm!: FormGroup;
  showModuleForm: boolean = false;
  @Input() courseId!: string;
  @Output() moduleAdded = new EventEmitter<ModuleRequest>();
  @Output() popupClosed = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private courseService: CourseService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  addModule(module: ModuleRequest) {
    const moduleWithCourseId = { ...module, courseId: this.courseId };
    this.courseService.addModuleToCourse(moduleWithCourseId).subscribe({
      next: (res: ModuleRequest) => {
        this.moduleAdded.emit(res);
        this.toastr.success('Module added successfully', 'Success');
        this.closePopup();
      },
      error: (err) => {
        this.toastr.error(err, 'Error');
        console.error(err);
      }
    });
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
    this.popupClosed.emit();
  }
}

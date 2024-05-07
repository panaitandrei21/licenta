import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "../../services/course.service";
import {ModuleRequest} from "../../interfaces/module-request";
import {Observable} from "rxjs";

@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrl: './edit-module.component.css'
})
export class EditModuleComponent implements OnInit {
  moduleForm!: FormGroup;
  moduleId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.route.params.subscribe(params => {
      this.moduleId = params['id'];
      if (this.moduleId) {
        this.fetchModule(this.moduleId).subscribe(
          moduleData => {
            this.moduleForm.patchValue({
              title: moduleData.title,
              description: moduleData.description
            });
          },
          error => console.error('Failed to load module:', error)
        );
      } else {
        console.error('Module ID is undefined');
      }
    });
  }

  fetchModule(moduleId: string): Observable<ModuleRequest> {
    return this.courseService.getModuleById(moduleId);
  }

  onSubmit(): void {
    if (this.moduleForm.valid) {
      const updatedModule: ModuleRequest = {
        ...this.moduleForm.value
      };
      this.updateModule(updatedModule);
    } else {
      console.error('Form is not valid');
    }
  }

  updateModule(module: ModuleRequest): void {
    if (this.moduleId) {
      module.moduleId = this.moduleId;
      this.courseService.updateModule(module).subscribe({
        next: () => this.router.navigate(['/course', this.courseService.getCurrentCourseId()]),
        error: error => console.error('Failed to update module:', error)
      });
    } else {
      console.error('Module ID is undefined; cannot update module');
    }
  }
}

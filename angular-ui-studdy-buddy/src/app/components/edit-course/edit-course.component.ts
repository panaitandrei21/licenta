import { Component, OnInit } from '@angular/core';
import { CourseService } from "../../services/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  courseId!: string;
  imageForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private courseService: CourseService, private route: ActivatedRoute,
              private fb: FormBuilder, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });

    this.imageForm = this.fb.group({
      image: new FormControl(null)
    });
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      this.imageForm.patchValue({
        image: file
      });
      this.imageForm.get('image')!.updateValueAndValidity();
    }
  }

  saveImage(): void {
    const formData = new FormData();
    const file = this.imageForm.get('image')!.value;

    if (file) {
      formData.append('imageData', file);

      this.courseService.updateCourseImage(this.courseId, formData).subscribe({
        next: (response) => {
          this.toastr.success('Course image updated successfully', 'Success');
          this.router.navigate(['/home'])
          },
        error: (error) =>  {
          this.toastr.error(error, 'Error')
        }
      });
    } else {
      console.error('No file selected');
    }
  }
}

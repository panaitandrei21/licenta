import { Component, OnInit } from '@angular/core';
import { CourseService } from "../../services/course.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  courseId!: string;
  imageForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private courseService: CourseService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });

    this.imageForm = this.fb.group({
      image: ['']
    });
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveImage() {
    const formData = new FormData();
    const file = this.imageForm.get('image')!.value;

    formData.append('imageData', file);

    this.courseService.updateCourseImage(this.courseId, formData).subscribe({
      next: (response) => console.log('Image saved successfully!'),
      error: (error) => console.error('Error saving image', error)
    });
  }

}

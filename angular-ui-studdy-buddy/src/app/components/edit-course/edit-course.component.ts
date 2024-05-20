import { Component, OnInit } from '@angular/core';
import { CourseService } from "../../services/course.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

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

    // Initialize the form group and define the form control 'image'
    this.imageForm = this.fb.group({
      image: new FormControl(null) // Use null as initial value
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

      // Update the form control with the file
      this.imageForm.patchValue({
        image: file
      });
      this.imageForm.get('image')!.updateValueAndValidity(); // Ensure the control validity is updated
    }
  }

  saveImage(): void {
    const formData = new FormData();
    const file = this.imageForm.get('image')!.value;  // Ensure this retrieves the file correctly

    if (file) {
      formData.append('imageData', file);

      this.courseService.updateCourseImage(this.courseId, formData).subscribe({
        next: (response) => console.log('Image saved successfully!'),
        error: (error) => console.error('Error saving image', error)
      });
    } else {
      console.error('No file selected');
    }
  }
}

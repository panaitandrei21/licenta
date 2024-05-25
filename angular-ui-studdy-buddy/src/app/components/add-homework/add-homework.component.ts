import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-homework',
  templateUrl: './add-homework.component.html',
  styleUrls: ['./add-homework.component.css']
})
export class AddHomeworkComponent {
  @Input() moduleId!: string;
  @Output() homeworkAdded = new EventEmitter<void>();
  @Output() popupClosed = new EventEmitter<void>();

  homeworkForm: FormGroup;
  selectedAssignment: any = null;

  constructor(private fb: FormBuilder, private courseService: CourseService, private toastr: ToastrService) {
    this.homeworkForm = this.fb.group({
      assignmentId: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.homeworkForm.valid) {
      this.courseService.addHomework(this.moduleId, this.homeworkForm.value).subscribe({
        next: (res) => {
          this.toastr.success('Assignment added successfully', 'Success');
          this.homeworkAdded.emit();
          this.onPopupClosed();
        },
        error: (err) => {
          this.toastr.error('Failed to add assignment', 'Error');
          console.error(err);
        }
      });
    }
  }

  onAssignmentSelected(assignment: any) {
    this.selectedAssignment = assignment;
    this.homeworkForm.patchValue({
      assignmentId: assignment.assignmentId
    });
  }


  onPopupClosed() {
    this.popupClosed.emit();
  }

}

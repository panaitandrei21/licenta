import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import {AssignmentService} from "../../services/assignment.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AssignmentSubmission} from "../../interfaces/assignment-instance";
import {CourseService} from "../../services/course.service";
import {HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-review-submission',
  templateUrl: './review-submission.component.html',
  styleUrl: './review-submission.component.css'
})
export class ReviewSubmissionComponent implements OnInit {
  courseId: string | null = '';
  submissionId: string | null = '';
  reviewForm: FormGroup;
  assignmentSubmission!: AssignmentSubmission;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private toastr: ToastrService,
    private courseService: CourseService
  ) {
    this.reviewForm = this.fb.group({
      title: [{ value: '', disabled: true }],
      submissionId: [{ value: '', disabled: true }],
      filename: [{ value: '', disabled: true }],
      studentName: [{ value: '', disabled: true }],
      grade: ['', [Validators.required]],
      feedback: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.submissionId = this.route.snapshot.paramMap.get('submissionId');
    this.loadSubmissionDetails();
  }

  loadSubmissionDetails(): void {
    if (this.submissionId) {
      this.assignmentService.getSubmissionDetails(this.submissionId).subscribe({
        next: (response) => {
          this.assignmentSubmission = response as AssignmentSubmission;
          this.reviewForm.patchValue({
            title: this.assignmentSubmission.assignmentInstanceName,
            submissionId: this.assignmentSubmission.submissionId,
            studentName: `${this.assignmentSubmission.user.firstName} ${this.assignmentSubmission.user.lastName}`,
            filename: this.assignmentSubmission.submittedFilePath
          });
        },
        error: (err) => {
          this.toastr.error('Failed to load submission details', 'Error');
        }
      });
    }
  }

  onSubmitReview(): void {
    if (this.reviewForm.valid) {
      const reviewData = this.reviewForm.getRawValue();
      if (this.submissionId) {
        this.assignmentService.submitReview(this.submissionId, reviewData).subscribe({
          next: () => {
            this.toastr.success('Review submitted successfully', 'Success');
          },
          error: (err) => {
            this.toastr.error('Failed to submit review', 'Error');
          }
        });
      } else {
        this.toastr.error('Submission ID is missing', 'Error');
      }
    }
  }
  downloadFile(filename: string): void {
    this.courseService.downloadFile(filename).subscribe(
      event => {
        this.reportProgress(event);
      },
      error => console.error('Error downloading the file!', error.message)
    );
  }

  private reportProgress(httpEvent: HttpEvent<any>): void {
    if (httpEvent.type === HttpEventType.Response && httpEvent instanceof HttpResponse) {
      if (httpEvent.body instanceof Blob) {
        const filename = httpEvent.headers.get('File-Name') ?? 'downloaded-file';
        saveAs(new File([httpEvent.body], filename, {
          type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`
        }));
      }
    }
  }
}

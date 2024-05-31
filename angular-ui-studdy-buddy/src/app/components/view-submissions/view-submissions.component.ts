import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { CourseService } from '../../services/course.service';
import { ToastrService } from 'ngx-toastr';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { SearchResults, SearchSubmissionResults } from '../../interfaces/search-result';

@Component({
  selector: 'app-view-submissions',
  templateUrl: './view-submissions.component.html',
  styleUrls: ['./view-submissions.component.css']
})
export class ViewSubmissionsComponent implements OnInit {
  courseId: string | null = '';
  submissions!: SearchSubmissionResults;
  searchTableForm: FormGroup;
  page: number = 0;
  pageSize: number = 20;
  searchResults: SearchSubmissionResults;
  searchParams: Params = {};

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private courseService: CourseService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchTableForm = this.fb.group({
      assignmentInstanceId: [''],
      studentFirstName: [''],
      studentLastName: [''],
      assignmentName: [''],
      submissionDate: [''],
    });
    this.searchResults = {
      submissions: [],
      totalPages: 1
    }
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      if (params['assignmentName']) {
        this.searchTableForm.patchValue({ assignmentName: params['assignmentName'] });
        this.searchParams = this.searchTableForm.value;
        this.searchAssignmentSubmissions();
      }
    });
    this.searchAssignmentSubmissions();
  }

  search() {
    this.page = 0;
    this.searchParams = this.searchTableForm.value;
    this.searchAssignmentSubmissions();
  }

  searchAssignmentSubmissions(page: number = 0): void {
    this.assignmentService.searchSubmissions(this.searchParams, this.page, this.pageSize).subscribe({
      next: (response: any) => {
        console.log(response);
        this.searchResults = response;
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      }
    });
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

  goToPage(page: number) {
    this.page = page;
    this.searchAssignmentSubmissions();
  }

  onReviewClick(submissionId: string) {
    this.toastr.info('Navigating to the review page!', 'Info');
    this.router.navigate([`/course/${this.courseId}/submissions/${submissionId}`]);
  }
}

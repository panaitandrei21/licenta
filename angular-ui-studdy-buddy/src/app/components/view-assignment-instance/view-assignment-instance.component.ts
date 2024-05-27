import { Component, OnInit, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../interfaces/course';
import { saveAs } from 'file-saver';
import { CourseService } from '../../services/course.service';
import { HttpEvent, HttpEventType, HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-view-assignment-instance',
  templateUrl: './view-assignment-instance.component.html',
  styleUrls: ['./view-assignment-instance.component.css']
})
export class ViewAssignmentInstanceComponent implements OnInit {
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent;
  assignmentId: string | null = '';
  assignment: Assignment | null = null;
  viewForm: FormGroup;
  modules = {
    syntax: true,
    toolbar: false
  };
  selectedFile: File | null = null;
  submittedFilePath: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private fb: FormBuilder,
    private courseService: CourseService,
    private toastr: ToastrService
  ) {
    this.viewForm = this.fb.group({
      content: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentId = id;
    if (id) {
      this.assignmentService.getAssignmentInstanceById(id).subscribe((assignment: Assignment) => {
        this.assignment = assignment;
        const decodedContent = this.cleanBase64String(this.b64DecodeUnicode(assignment.content));
        if (decodedContent !== null) {
          this.viewForm.patchValue({
            content: decodedContent
          });
        } else {
          console.error('Failed to decode assignment content');
        }
      });
    }
    this.loadLatestSubmissionFilename(this.assignmentId);
  }

  loadLatestSubmissionFilename(assignmentInstanceId: string | null): void {
    this.assignmentService.getLatestSubmission(assignmentInstanceId).subscribe({
      next: filename => this.submittedFilePath = filename,
      error: () => console.error('Failed to load the latest submission filename')
    });
  }

  private formatDate(dateString: Date): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  b64DecodeUnicode(str: any): string {
    const decoded = decodeURIComponent(Array.from(atob(str), (c) =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    const cleaned = decoded.replace(/\\/g, '');
    return cleaned;
  }

  cleanBase64String(str: string): string {
    return str.replace(/"image/g, 'image').replace(/"/g, '');
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files && files.length > 0) {
      this.selectedFile = files.item(0);
    }
  }

  onSubmit(): void {
    if (!this.selectedFile || !this.assignmentId) {
      console.error('File or assignment ID not provided!');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('assignmentInstanceId', this.assignmentId);

    this.assignmentService.submitAssignment(formData).subscribe({
      next: (response) => console.log('Submission successful', response),
      error: (error) => console.error('Submission failed', error)
    });
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

  downloadSubmission(filename: string): void {
    this.courseService.downloadFile(filename).subscribe({
      next: (event) => {
        this.reportProgress(event);
        this.toastr.success('Submitted successfully', 'Success');
      },
      error: (error) => console.error('Error downloading the file!', error)
    });
  }
}

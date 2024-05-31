import { Component, OnInit, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssignmentService } from '../../services/assignment.service';
import { CourseService } from '../../services/course.service';
import { ToastrService } from 'ngx-toastr';
import { AssignmentInstance } from '../../interfaces/assignment-instance';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import {Assignment} from "../../interfaces/course";

@Component({
  selector: 'app-view-assignment-instance',
  templateUrl: './view-assignment-instance.component.html',
  styleUrls: ['./view-assignment-instance.component.css']
})
export class ViewAssignmentInstanceComponent implements OnInit {
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent;
  assignmentId: string | null = '';
  assignment: AssignmentInstance | null = null;
  viewForm: FormGroup;
  solutionForm: FormGroup;
  modules = {
    syntax: true,
    toolbar: false
  };
  selectedFile: File | null = null;
  submittedFilePath: string | undefined;
  solutionContent: string | undefined;
  grade: number | undefined; // Variable to store the grade
  feedback: string | undefined; // Variable to store the feedback

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
    this.solutionForm = this.fb.group({
      solution: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentId = id;
    if (id) {
      this.assignmentService.getAssignmentInstanceById(id).subscribe((assignmentInstance: any) => {
        console.log(assignmentInstance);
        this.assignment = assignmentInstance;
        const decodedContent = this.cleanBase64String(this.b64DecodeUnicode(assignmentInstance.assignment.content));
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
    this.loadSolutionContent(this.assignmentId);
  }

  loadLatestSubmissionFilename(assignmentInstanceId: string | null): void {
    this.assignmentService.getLatestSubmission(assignmentInstanceId).subscribe({
      next: (res) => {
        console.log(res);
        this.submittedFilePath = res as string;
      },
      error: () => console.error('Failed to load the latest submission filename')
    });
  }

  loadSolutionContent(assignmentInstanceId: string | null): void {
    this.assignmentService.getSolvedAssignment(assignmentInstanceId!).subscribe({
      next: (res) => {
        const assignment = res as Assignment;
        console.log(assignment);
        this.grade = assignment.grade;
        this.feedback = assignment.feedback;
        const decodedSolution = this.cleanBase64String(this.b64DecodeUnicode(assignment.solution));
        if (decodedSolution !== null) {
          this.solutionForm.patchValue({
            solution: decodedSolution,
            feedback: assignment.feedback,
            grade: assignment.grade
          });
          this.solutionContent = decodedSolution;
        } else {
          console.error('Failed to decode solution content');
        }
      },
      error: () => console.error('Failed to load the solution content')
    });
  }

  formatDate(dateString: Date | undefined): string {
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

  isExpired(): boolean {
    if (!this.assignment || !this.assignment.dueDate) {
      return false;
    }
    const dueDate = new Date(this.assignment.dueDate);
    const currentDate = new Date();
    return currentDate > dueDate;
  }

  onSubmit(): void {
    if (this.isExpired()) {
      this.toastr.error('The due date has passed. You cannot submit the assignment.');
      return;
    }

    if (!this.selectedFile || !this.assignmentId) {
      console.error('File or assignment ID not provided!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('assignmentInstanceId', this.assignmentId);

    this.assignmentService.submitAssignment(formData).subscribe({
      next: (response) => {
        this.toastr.success('Assignment submitted successfully', 'Success');
        this.loadLatestSubmissionFilename(this.assignmentId);
      },
      error: (error) => this.toastr.error('Submission failed', error)
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
      },
      error: (error) => console.error('Error downloading the file!', error)
    });
  }
}

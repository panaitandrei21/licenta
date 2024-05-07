import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {CourseService} from "../../services/course.service";
import {ActivatedRoute} from "@angular/router";
import {ModuleRequest} from "../../interfaces/module-request";
import { saveAs } from 'file-saver'; // First, install file-saver using `npm install file-saver`

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit{
  showModuleForm: boolean = false;
  courseId!: string;
  fileStatus = {
    status: '',
    requestType: '',
    percent: 0,
    filenames: [] as string[]
  };
  modules!: ModuleRequest[];

  constructor(private route: ActivatedRoute, private http: HttpClient, private courseService: CourseService) {}

  toggleModuleForm(): void {
    this.showModuleForm = !this.showModuleForm;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.courseService.setCurrentCourseId(id);
    });
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
      this.loadModules();
    });
  }


  loadModules() {
    this.courseService.getModuleForCourse(this.courseId).subscribe(modules => {
      this.modules = modules;
    });
  }

  onFileSelected(event: any, moduleId: string): void {
    const file: File = event.target.files[0];
    if (file) {
      this.courseService.uploadFile(file, moduleId, this.courseId).subscribe(event => {
        this.resportProgress(event);
      }, error => console.error('Error uploading file!', error));
    }
  }

  downloadFile(filename: string) {
    this.courseService.downloadFile(filename, this.courseId).subscribe(
      event => {
        this.resportProgress(event);
      },
      error => console.error('Error downloading the file!', error.message)
    );
  }
  private resportProgress(httpEvent: HttpEvent<any>): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
      case HttpEventType.DownloadProgress:
        if (httpEvent.total) {
          this.updateStatus(httpEvent.loaded, httpEvent.total, httpEvent.type === HttpEventType.UploadProgress ? 'Uploading...' : 'Downloading...');
        }
        break;
      case HttpEventType.Response:
        this.fileStatus.status = 'done';
        this.fileStatus.percent = 100;
        this.fileStatus.requestType = 'Completed';

        if (httpEvent.body instanceof Blob) {
          // Handling Blob for downloads
          const filename = httpEvent.headers.get('File-Name')?.valueOf();
          console.log(filename);
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
        }

        setTimeout(() => {
          this.resetProgress();
        }, 3000);
        break;
      default:
        console.log('Unhandled HTTP event:', httpEvent.type, httpEvent);
        break;
    }
  }

  private resetProgress(): void {
    this.fileStatus.status = '';
    this.fileStatus.requestType = '';
    this.fileStatus.percent = 0;
  }



  private updateStatus(loaded: number, total: number, requestType: string): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }

  editModule(module: any) {

  }

  deleteModule(module: ModuleRequest): void {
    this.courseService.deleteModule(module.moduleId).subscribe({
      next: (response) => {
        console.log('Module deleted:', response);

        this.modules = this.modules.filter(m => m.moduleId !== module.moduleId);
      },
      error: (error) => {
        console.error('Failed to delete module:', error);
      }
    });
  }

  deleteFile(moduleId: any, filePath: string, i: number) {

  }
}

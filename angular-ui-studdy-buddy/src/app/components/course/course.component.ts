import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from "@angular/common/http";
import { CourseService } from "../../services/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import { FilePath, ModuleRequest } from "../../interfaces/module-request";
import { saveAs } from 'file-saver';
import { Course } from "../../interfaces/course";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  showModuleForm: boolean = false;
  courseDetails: Course | undefined;
  userRole: string = this.authService.user!.role;
  courseId!: string;
  fileStatus = {
    status: '',
    requestType: '',
    percent: 0,
    filenames: [] as string[]
  };
  modules!: ModuleRequest[];
  showHomeworkForm: any;
  selectedHomeworkTitle: string | null = null;

  constructor(private router: Router,private route: ActivatedRoute, private http: HttpClient, private courseService: CourseService, private authService: AuthService) {}

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
    this.courseService.getCourseDetails(this.courseId).subscribe(
      res => this.courseDetails = res as Course
    );
    this.courseService.getModuleForCourse(this.courseId).subscribe(modules => {
      this.modules = modules;
    });
  }

  onFileSelected(event: any, moduleId: string): void {
    const file: File = event.target.files[0];
    if (file) {
      this.courseService.uploadFile(file, moduleId, this.courseId).subscribe(event => {
        this.resportProgress(event);

        if (event.type === HttpEventType.Response) {
          this.updateModuleFiles(moduleId, event.body);
        }

      }, error => console.error('Error uploading file!', error));
    }
  }

  private updateModuleFiles(moduleId: string, moduleData: ModuleRequest): void {
    let index = this.modules.findIndex(mod => mod.moduleId === moduleId);
    if (index !== -1) {
      moduleData.assignmentInstances = this.modules[index].assignmentInstances;
      this.modules[index] = moduleData;
    } else {
      console.error('Module not found:', moduleId);
    }
  }

  downloadFile(filename: string) {
    this.courseService.downloadFile(filename).subscribe(
      event => {
        this.resportProgress(event);
      },
      error => console.error('Error downloading the file!', error.message)
    );
  }
  navigateToAllSubmissions(): void {
    this.router.navigate(['/course', this.courseId, 'submissions']);
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
          const filename = httpEvent.headers.get('File-Name')?.valueOf();
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
        }

        setTimeout(() => {
          this.resetProgress();
        }, 3000);
        break;
      default:
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

  editModule(module: any) {}

  deleteModule(module: ModuleRequest): void {
    this.courseService.deleteModule(module.moduleId).subscribe({
      next: (response) => {
        this.modules = this.modules.filter(m => m.moduleId !== module.moduleId);
      },
      error: (error) => {
        console.error('Failed to delete module:', error);
      }
    });
  }

  deleteFile(filePath: FilePath, moduleId: string) {
    this.courseService.deleteFile(filePath.fileDescriptionsId).subscribe({
      next: (res) => {
        const module = this.modules.find(m => m.moduleId === moduleId);
        if (module) {
          const index = module.filePath.findIndex(f => f.fileDescriptionsId === filePath.fileDescriptionsId);
          if (index !== -1) {
            module.filePath.splice(index, 1);
          }
        }
      },
      error: (error) => {
        console.error('Failed to delete module:', error);
      }
    });
  }

  toggleHomeworkForm(moduleId: string) {
    if (this.showHomeworkForm === moduleId) {
      this.showHomeworkForm = null;
    } else {
      this.showHomeworkForm = moduleId;
    }
  }

  onHomeworkAdded() {
    this.loadModules();
    this.selectedHomeworkTitle = null;
  }

  onModuleClosed() {
    this.showModuleForm = false;
  }
  onHomeworkClosed() {
    this.showHomeworkForm = null;
  }

  deleteAssignment(assignmentInstanceId: any) {
    this.courseService.deleteAssignmentInstance(assignmentInstanceId).subscribe({
      next: (res) => {

      },
      error: (err) => {

      }
    })
  }

  navigateToSubmissionsWithSearch(assignmentTitle: string): void {
    this.router.navigate(['/course', this.courseId, 'submissions'], { queryParams: { assignmentName: assignmentTitle } });
  }

  navigateToAddProblem() {
    this.router.navigate(['/add/problem']);

  }
}

import {Component, OnInit} from '@angular/core';
import {UserDTO} from "../../interfaces/user-dto";
import {GridApi, GridOptions} from "ag-grid-community";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {AdminService} from "../../services/admin.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {EnrollComponent} from "../enroll/enroll.component";
import {SeeUserCoursesComponent} from "../see-user-courses/see-user-courses.component";
import {Course} from "../../interfaces/course";

@Component({
  selector: 'app-handle-courses',
  templateUrl: './handle-courses.component.html',
  styleUrl: './handle-courses.component.css'
})
export class HandleCoursesComponent implements OnInit {
  courses!: Course[];
  private gridApi!: GridApi;
  private ChargridApi!: GridApi;
  selectedData: Course[] | undefined;
  gridOptions: GridOptions = {
    columnDefs: [
      { field: "courseId", checkboxSelection: true, headerCheckboxSelection: true},
      { field: "category", filter: true, editable: true },
      { field: "courseName", filter: true, editable: true },
      { field: "description", filter: true, editable: true },
    ],
    rowSelection: "multiple",
    onRowSelected: event => this.getSelectedRows(),
    onCellValueChanged: event => this.handleCellValueChange(event),
  };
  openDialog(): void {
    const dialogRef = this.dialog.open(EnrollComponent, {
      width: 'fit-content',
      data: { courseId: this.selectedData?.map(value => value.courseId) }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }


  constructor( private http: HttpClient,
               private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private msgService: MessageService,
               private adminService: AdminService,
               public dialog: MatDialog,
               private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.fetchCourses();
  }
  fetchCourses(): void {
    this.adminService.getAllCourses().subscribe(res => {
      this.courses = res as Course[];
      this.gridApi.refreshCells();
    });
  }
  getSelectedRows() {
    this.selectedData = this.ChargridApi?.getSelectedRows();
    console.log(this.selectedData);

  }
  onGridReady(params: any) {
    this.ChargridApi = params.api;
    this.gridApi = params.api;
  }




  // getCoursesForUserSelected() {
  //   if (this.selectedData && this.selectedData.length > 0) {
  //     const selectedUser = this.selectedData[0];
  //     const dialogRef = this.dialog.open(SeeUserCoursesComponent, {
  //       width: 'fit-content',
  //       data: { user: selectedUser }
  //     });
  //     console.log(dialogRef)
  //
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed', result);
  //     });
  //   }
  // }

  deleteCourse() {
    if (this.selectedData) {
      const courseId = this.selectedData[0].courseId;
      console.log(courseId);
      this.adminService.deleteCourse(courseId).subscribe(res => {
        console.log(res);
        this.toastr.success("Course deleted succesfully");
        this.fetchCourses()
      });
    }

  }
  handleCellValueChange(event: any) {
    if (event.newValue !== event.oldValue) {
      this.adminService.updateCourse(event.data).subscribe(
        response => {
          console.log('Update successful', response);
          this.toastr.success("Course updated succesfully");
        },
        error => {
          console.log('Update failed', error);
          this.msgService.add({severity: 'error', summary: 'Error', detail: 'Update failed'});
        }
      );
      console.log(event.newValue)
    }
  }
}

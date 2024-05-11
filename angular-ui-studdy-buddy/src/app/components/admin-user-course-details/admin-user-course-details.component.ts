import {Component, OnInit} from '@angular/core';
import {UserDTO} from "../../interfaces/user-dto";
import {GridApi, GridOptions} from "ag-grid-community";
import {EnrollComponent} from "../enroll/enroll.component";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {AdminService} from "../../services/admin.service";
import {MatDialog} from "@angular/material/dialog";
import {SeeUserCoursesComponent} from "../see-user-courses/see-user-courses.component";

@Component({
  selector: 'app-admin-user-course-details',
  templateUrl: './admin-user-course-details.component.html',
  styleUrl: './admin-user-course-details.component.css'
})
export class AdminUserCourseDetailsComponent implements OnInit {
  users: UserDTO[] | undefined;
  private gridApi!: GridApi;
  private ChargridApi!: GridApi;
  selectedData: UserDTO[] | undefined;
  gridOptions: GridOptions<UserDTO> = {
    columnDefs: [
      { field: "id", checkboxSelection: true, headerCheckboxSelection: true},
      { field: "firstName", filter: true, editable: true },
      { field: "lastName", filter: true, editable: true },
      { field: "email", filter: true, editable: true },
      { field: "role", filter: true, editable: true },
    ],
    rowSelection: "multiple",
    onRowSelected: event => this.getSelectedRows(),
    onCellValueChanged: event => this.handleCellValueChange(event),
  };
  openDialog(): void {
    const dialogRef = this.dialog.open(EnrollComponent, {
      width: 'fit-content',
      data: { userId: this.selectedData?.map(value => value.id) }
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
               public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers(): void {
    this.adminService.getTeachers().subscribe(res => {
      this.users = res as UserDTO[];
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




  getCoursesForUserSelected() {
    if (this.selectedData && this.selectedData.length > 0) {
      const selectedUser = this.selectedData[0];
      const dialogRef = this.dialog.open(SeeUserCoursesComponent, {
        width: 'fit-content',
        data: { user: selectedUser }
      });
      console.log(dialogRef)

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }
  }

  deleteUser() {
    this.adminService.deleteUsers(this.selectedData as UserDTO[]).subscribe(res => {
      console.log(res);
      this.fetchUsers();
    });
  }
  handleCellValueChange(event: any) {
    if (event.newValue !== event.oldValue) {
      this.adminService.updateUser(event.data).subscribe(
        response => {
          console.log('Update successful', response);
          this.msgService.add({severity: 'success', summary: 'Success', detail: 'User updated successfully'});
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

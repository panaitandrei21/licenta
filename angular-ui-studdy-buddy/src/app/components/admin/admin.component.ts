import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {UserDTO} from "../../interfaces/user-dto";
import {GridApi, GridOptions} from 'ag-grid-community';
import {AdminService} from "../../services/admin.service";
import {Course} from "../../interfaces/course";
import {MatDialog} from "@angular/material/dialog";
import {EnrollComponent} from "../enroll/enroll.component";
import {SeeUserCoursesComponent} from "../see-user-courses/see-user-courses.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
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


  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: [''],
  })
  courseForm = this.fb.group({
    courseName: ['', [Validators.required, Validators.minLength(1)]], // Make sure it's initialized and required
    description: [''],
    category: ['', Validators.required],
  });

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


  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get firstName() {
    return this.registerForm.controls['firstName'];
  }
  get role() {
    return this.registerForm.controls['role'];
  }
  get lastName() {
    return this.registerForm.controls['lastName'];
  }
  get courseName() {
    return this.courseForm.get('courseName');
  }

  get category() {
    return this.courseForm.get('category');
  }
  registerTeacher() {
    if (this.registerForm.valid) {
      const { email, password, lastName, firstName } = this.registerForm.value;
      const user: { firstName: string; lastName: string; password: string; email: string } = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        password: password || '',
      };
    console.log(user);
      this.authService.addTeacher(user).subscribe(
        (response: any) => {
          console.log(response);
          this.fetchUsers();
        },
        (error) => {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      );
    }
  }


  deleteUser() {
    this.adminService.deleteUsers(this.selectedData as UserDTO[]).subscribe(res => {
      console.log(res);
      this.fetchUsers();
    });
  }

  onCreateCourse() {
    if (this.courseForm.valid) {
      const courseData: Course = {
        courseId: '',
        courseName: this.courseForm.value.courseName!,
        description: this.courseForm.value.description!,
        category: this.courseForm.value.category!
      };

      this.adminService.createCourse(courseData).subscribe(
        response => {
          console.log(response);
        }
      );
    }
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

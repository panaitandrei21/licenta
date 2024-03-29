import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserDTO} from "../../interfaces/user-dto";
import {ColDef, createGrid, GridApi, GridOptions} from 'ag-grid-community';
import {AdminService} from "../../services/admin.service";
import {Observable} from "rxjs";
import {Course} from "../../interfaces/course";
import {MatDialog} from "@angular/material/dialog";
import {EnrollComponent} from "../enroll/enroll.component";
import { ChangeDetectorRef } from '@angular/core';

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
      { field: "firstName", filter: true},
      { field: "lastName", filter: true },
      { field: "email", filter: true },
      { field: "role", filter: true },
    ],
    rowSelection: "multiple",
    onRowSelected: event => this.getSelectedRows(), // Add this line
  };
  openDialog(): void {
    const dialogRef = this.dialog.open(EnrollComponent, {
      width: '250px',
      data: { userId: this.selectedData?.map(value => value.id) } // Pass the selected user ID to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Handle the dialog close event and result here, such as refreshing data or showing a message
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
               public dialog: MatDialog,
               private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers(): void {
    this.adminService.getTeachers().subscribe(res => {
      this.users = res as UserDTO[];
      this.gridApi.refreshCells(); // Method to refresh the grid, if necessary.
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
          this.fetchUsers(); // Refresh the user list
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
      this.fetchUsers(); // Refresh the user list
    });
  }

  onCreateCourse() {
    if (this.courseForm.valid) { // Check if the form is valid
      const courseData: Course = {
        courseId: null,
        courseName: this.courseForm.value.courseName!,
        description: this.courseForm.value.description!,
        category: this.courseForm.value.category!
      };

      this.adminService.createCourse(courseData).subscribe(
        response => {
          console.log(response);
           // Handle successful course creation (e.g., display a success message or redirect)
        }
      );
    }
  }
}

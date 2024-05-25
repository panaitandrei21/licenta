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
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-admin-handle-user',
  templateUrl: './admin-handle-user.component.html',
  styleUrl: './admin-handle-user.component.css'
})
export class AdminHandleUserComponent {
  users: UserDTO[] | undefined;
  private gridApi!: GridApi;
  private ChargridApi!: GridApi;
  selectedData: UserDTO[] | undefined;


  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: [''],
  })

  constructor( private http: HttpClient,
               private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private msgService: MessageService,
               private adminService: AdminService,
               public dialog: MatDialog,
               private toastr: ToastrService
  ) { }

  fetchUsers(): void {
    this.adminService.getTeachers().subscribe(res => {
      this.users = res as UserDTO[];
      this.gridApi.refreshCells();
    });
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
          this.toastr.success('User added successfully', 'Success');
          this.fetchUsers();
        },
        (error) => {
          this.toastr.error(error, 'Error');
        }
      );
    }
  }


}

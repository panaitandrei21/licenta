import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserDTO} from "../../interfaces/user-dto";
import {ColDef, createGrid, GridApi, GridOptions} from 'ag-grid-community';
import {AdminService} from "../../services/admin.service";
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  users: UserDTO[] | undefined;
  gridApi: GridApi<UserDTO> | undefined;
  gridOptions: GridOptions<UserDTO> = {
    columnDefs: [
      { field: "id", checkboxSelection: true, headerCheckboxSelection: true},
      { field: "firstName", filter: true},
      { field: "lastName", filter: true },
      { field: "email", filter: true },
      { field: "role", filter: true },
    ],
  };
  removeUser(userId: number) {
    console.log("remove user");
  }
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
    private adminService: AdminService
  ) { }
  ngOnInit(): void {
    this.adminService.getTeachers().subscribe(res => {
      // console.log(res);
      this.users = res as UserDTO[];
    });
  }
  onGridReady() {

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
        (response : any) => {
          console.log(response)
        },
        (error) => {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

        }
      );
    }
  }



}

import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
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
    private msgService: MessageService
  ) { }

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
        firstName: firstName || '', // Provide a default empty string if password is null or undefined
        lastName: lastName || '', // Provide a default empty string if password is null or undefined
        email: email || '', // Provide a default empty string if email is null or undefined
        password: password || '', // Provide a default empty string if password is null or undefined
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

  ngOnInit(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http.get(`http://localhost:8080/api/admin/add/teacher`, httpOptions).subscribe(res => console.log(res));
  }

}

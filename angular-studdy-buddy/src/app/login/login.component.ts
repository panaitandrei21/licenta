import { Component } from '@angular/core';
import {Form, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['', Validators.required,]
  });
  constructor(private fb: FormBuilder) {
  }
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
}

import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {User} from "../../interfaces/auth";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  loginError = false;
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  })

  constructor(
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
  get lastName() {
    return this.registerForm.controls['lastName'];
  }
  resetRegisterError() {
    this.loginError = false;
  }
  registerUser() {
    if (this.registerForm.valid) {
      const { email, password, lastName, firstName } = this.registerForm.value;
      const user: { firstName: string; lastName: string; password: string; email: string } = {
        email: email || '', // Provide a default empty string if email is null or undefined
        password: password || '', // Provide a default empty string if password is null or undefined
        firstName: firstName || '', // Provide a default empty string if password is null or undefined
        lastName: lastName || '', // Provide a default empty string if password is null or undefined
      };

      this.authService.register(user).subscribe(
        (response : any) => {
          const responseData = response;
          // Check if the "token" property exists in the parsed response
          if (responseData && responseData.token) {
            // Token received, indicating successful login
            // You can save the token in local storage or a cookie for future authenticated requests
            localStorage.setItem('studdyBuddy_token', responseData.token);

            // Redirect the user to the dashboard or another page
            // You can use Angular's Router for navigation
            // Example: this.router.navigate(['/dashboard']);
            this.router.navigate(['/home']);

          } else {
            // No "token" property in the response, indicating incorrect username or password
            // You can display an error message to the user
            this.loginError = true;
            this.msgService.add({ severity: 'error', summary: 'Error', detail: 'email or password is wrong' });
          }

        },
        (error) => {
          // Handle errors (e.g., show error message to the user)
          this.loginError = true;

          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

        }
      );
    }
  }

}

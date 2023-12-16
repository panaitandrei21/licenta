import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth';
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginError = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService
  ) { }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() { return this.loginForm.controls['password']; }

  loginUser() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const user: User = {
        email: email || '', // Provide a default empty string if email is null or undefined
        password: password || '' // Provide a default empty string if password is null or undefined
      };

      this.authService.loginUser(user).subscribe(
        (response : any) => {
            const responseData = response;
            // Check if the "token" property exists in the parsed response
            if (responseData && responseData.token) {
              // Token received, indicating successful login
              // You can save the token in local storage or a cookie for future authenticated requests
              localStorage.setItem('token', responseData.token);
              const tokenInfo = jwtDecode(responseData.token) as {role: string};
              const role = tokenInfo.role;

              if (role === 'ADMIN') {
                this.router.navigate(['/admin'])
              } else {
                console.log(tokenInfo.role);
                this.router.navigate(['/home']);
              }

              console.log('Login successful. Token:', responseData.token);

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
      console.log(this.loginError);
    }
  }

  resetLoginError() {
    this.loginError = false;
  }
}

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
        email: email || '',
        password: password || ''
      };

      this.authService.loginUser(user).subscribe(
        (response : any) => {
            const responseData = response;
            if (responseData && responseData.token) {
              localStorage.setItem('studdyBuddy_token', responseData.token);
              const tokenInfo = jwtDecode(responseData.token) as {role: string};
              const role = tokenInfo.role;

              if (role === 'ROLE_ADMIN') {
                this.router.navigate(['/admin'])
              } else {
                this.router.navigate(['/home']);
              }


            } else {
              this.loginError = true;
              this.msgService.add({ severity: 'error', summary: 'Error', detail: 'email or password is wrong' });
            }

        },
        (error) => {
          this.loginError = true;

            this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

        }
      );
    }
  }

  resetLoginError() {
    this.loginError = false;
  }
}

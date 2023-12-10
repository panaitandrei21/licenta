import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm = new FormGroup({
    username: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),

  })
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {


  }

  registerFormSubmit(): void {
    // Add your registration logic here
    console.log('Form submitted:', this.registerForm.value);
  }
}

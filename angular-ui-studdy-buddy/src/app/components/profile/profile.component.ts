import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profileError: boolean = false;
  userEmail: string = this.authService.user!.sub;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    if (this.userEmail) {
      this.authService.getUserProfile(this.userEmail).subscribe({
        next: (profile) => {
          this.profileForm.patchValue(profile);
        },
        error: () => {
          this.profileError = true;
        }
      });
    } else {
      console.error('User email not available');
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.authService.updateUserProfile(this.profileForm.value).subscribe(res => console.log(res));
    }
  }

  resetProfileError(): void {
    this.profileError = false;
  }
}

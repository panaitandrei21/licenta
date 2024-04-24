import {Component, OnDestroy} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnDestroy {
  isLoggedIn = false;  // This is public and can be used directly in the template
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onLogout(): void {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
}

import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {tap} from "rxjs";
export const authGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn$.pipe(
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
      }
    })
  )
};

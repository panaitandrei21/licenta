import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthorized = authService.user?.role.includes(route.data['role']);
  if (!isAuthorized) {
    // redirect
    // display a message
    window.alert('you are not authorized');
  }

  return isAuthorized || false;
};

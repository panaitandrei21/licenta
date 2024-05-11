import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = Array.isArray(route.data['role']) ? route.data['role'] : [route.data['role']];
  console.log(requiredRoles);
  console.log(authService.user?.role);

  const isAuthorized = requiredRoles.some(role => authService.user?.role.includes(role));


  if (!isAuthorized) {
    window.alert('you are not authorized');
  }

  return isAuthorized || false;
};

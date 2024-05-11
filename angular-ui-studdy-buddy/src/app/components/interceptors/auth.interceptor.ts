import {HTTP_INTERCEPTORS, HttpInterceptorFn} from '@angular/common/http';
import {jwtDecode} from "jwt-decode";
import {inject} from "@angular/core";
import {Router} from "@angular/router";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('studdyBuddy_token');
  if (token) {
    let decodedToken = jwtDecode(token);
    const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;
    if (isExpired) {
      localStorage.removeItem('studdyBuddy_token');
      router.navigate(['/login']);
      throw new Error('Session expired. Redirecting to login.');
    }
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`,
      }
    })
  }
  return next(req);
};

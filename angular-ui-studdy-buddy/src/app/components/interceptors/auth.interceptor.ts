import {HTTP_INTERCEPTORS, HttpInterceptorFn} from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('studdyBuddy_token');
  if(token !== null) {
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`,
      }
    })
  }
  console.log(req);
  return next(req);
};

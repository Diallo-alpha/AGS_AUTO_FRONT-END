import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  let clonedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true
  });

  if (token) {
    clonedReq = clonedReq.clone({
      setHeaders: {
        ...clonedReq.headers,
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq);
};

import { HttpInterceptorFn, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Ne pas ajouter Content-Type pour FormData
    if (!(req.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const clonedRequest = req.clone({ headers });

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return next(clonedRequest.clone({
        headers: clonedRequest.headers
          .set('Access-Control-Allow-Origin', '*')
          .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          .set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      }));
    }

    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('access_token');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};

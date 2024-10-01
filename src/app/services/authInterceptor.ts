import { HttpInterceptorFn, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    const clonedRequest = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    });

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return next(clonedRequest.clone({
        headers: clonedRequest.headers.set('Access-Control-Allow-Origin', '*')
          .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          .set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      }));
    }

    return next(clonedRequest);
  }

  // If no token, proceed with the original request
  return next(req);
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'ogs_token';

/**
 * Functional HTTP interceptor that:
 * 1. Reads the JWT token from localStorage
 * 2. Attaches it as an Authorization: Bearer header to every outgoing request
 * 3. If a response returns 401 (Unauthorized), clears the token and redirects to /login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem(TOKEN_KEY);

  // Clone the request and add the Authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};

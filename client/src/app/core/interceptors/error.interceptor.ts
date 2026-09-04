import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      let errorMsg = 'An unknown error occurred!';
      
      if (error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message}`;
      } else if (error.error && error.error.message) {
        errorMsg = error.error.message;
      } else {
        errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }

      toastService.showError(errorMsg);

      if (error.status === 401) {
        authService.logout();
      }

      return throwError(() => new Error(errorMsg));
    })
  );
};

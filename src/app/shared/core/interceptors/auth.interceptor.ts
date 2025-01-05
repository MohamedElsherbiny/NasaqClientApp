import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authToken = localStorage.getItem('token');
        const newReq = request.clone({
            headers: request.headers.append('Authorization', `Bearer ${authToken}`),
        });
        return next.handle(newReq);
    }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private toastr: ToastrService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unexpected error occurred.';
                if (error.error?.message) {
                    errorMessage = error.error.message;
                }

                // Show validation errors if available
                if (error.error?.errors && Array.isArray(error.error.errors)) {
                    errorMessage = error.error.errors.map((e: any) => `${e.propertyName}: ${e.errorMessage}`).join('\n');
                }

                this.toastr.error(errorMessage, 'Error');
                return throwError(() => error);
            })
        );
    }
}
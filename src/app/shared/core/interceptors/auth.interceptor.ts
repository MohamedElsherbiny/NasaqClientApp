// import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

// export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
//     const authToken = localStorage.getItem('token');
//     debugger
//     const newReq = req.clone({
//         headers: req.headers.append('Authentication', `Bearer ${authToken}`),
//     });

//     return next(newReq);
// }

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

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
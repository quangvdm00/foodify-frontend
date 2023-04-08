import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // if (req.headers.get("skip")) {
        //     return next.handle(req);
        // }

        const token = localStorage.getItem('jwt-token');
        if (token != null) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                    // 'Access-Control-Allow-Origin': 'http://localhost:4200',
                    // 'Access-Control-Allow-Credentials': 'true',
                    // 'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
                    // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
                }
            });
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}

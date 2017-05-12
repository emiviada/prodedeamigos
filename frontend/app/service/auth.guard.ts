import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.auth.checkLoginStatus().map(value => {
            let isLoggedIn = (value)? true : false;
            if (!isLoggedIn) {
                // not logged in so redirect to login page with the return url
                this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
                return false;
            }
            return isLoggedIn;
        });
    }
}

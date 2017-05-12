import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';

// https://github.com/localForage/localForage
import * as localForage from "localforage";

@Injectable()
export class AuthService {

    // Create a stream of logged in status to communicate throughout app
    loggedIn: boolean;
    loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

    constructor(private http: Http, private fb: FacebookService, private router: Router) {
        const initParams: InitParams = {
          appId: '809333382485791',
          xfbml: true,
          version: 'v2.3'
        };

        fb.init(initParams);

        // Check if user is logged in
        this.isLoggedIn();
    }

    setLoggedIn(value: boolean) {
        // Update login status subject
        this.loggedIn$.next(value);
        this.loggedIn = value;
    }

    checkLoginStatus() {
        return Observable.fromPromise(localForage.getItem('prodeUser'));
    }

    isLoggedIn() {
        this.checkLoginStatus().subscribe(value => {
            let authenticated = (value)? true : false;
            this.setLoggedIn(authenticated);
        });
    }

    loginWithFacebook(): void {
        const options: LoginOptions = {
          scope: 'public_profile,email'
        };

        this.fb.login(options)
          .then((response: LoginResponse) =>  {
              console.log(response);
              localForage.setItem('prodeUser', response.authResponse.userID);
              this.setLoggedIn(true);
              this.router.navigate(['/dashboard']);
          })
          .catch((error: any) => console.error(error));

    }

    logout() {
        let router = this.router;
        // remove user from local storage to log user out
        localForage.removeItem('prodeUser').then(err => {
            this.setLoggedIn(false);
            router.navigate(['/']);
        });
    }

    /*login(username: string, password: string) {
        return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }*/
}

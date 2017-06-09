import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';

import { ApiService } from './api.service';
import { prodeUserKey } from '../global';

// https://github.com/localForage/localForage
import * as localForage from "localforage";

@Injectable()
export class AuthService {

    // Create a stream of logged in status to communicate throughout app
    loggedIn: boolean;
    loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

    loading = document.getElementById('loading');

    constructor(private api: ApiService, private fb: FacebookService, private router: Router) {
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

        this.loading.style.display = 'block';
        this.fb.login(options)
          .then((response: LoginResponse) =>  {
              //console.log(response);
              let fbId = response.authResponse.userID;
              let token = response.authResponse.accessToken;
              // Check if user exists
              this.api.findUsers({facebook_id: fbId})
                  .subscribe(
                      data  => {
                        if (data.length) { // User exists, just authenticate
                            let userId = data[0].id;
                            this.authenticate(userId, token);
                        } else { // Create the user
                          let fields = 'id,name,picture,email';
                          this.fb.api('/' + fbId + '?fields=' + fields)
                            .then(res => {
                              let picture = res.picture.data.url;
                              let params = {'user': {
                                'email': res.email,
                                'password': res.id,
                                'facebookId': res.id,
                                'username': res.name
                              }};
                              this.api.createUser(params)
                                .subscribe(
                                  data => {
                                    let p = data.split('/');
                                    let userId = p[3];
                                    this.authenticate(userId, token);
                                  },
                                  error => {return Observable.throw(error);}
                                );
                            })
                            .catch(error => {return Observable.throw(error);});
                        }
                      },
                      error => console.log(<any>error)
                  );
          })
          .catch((error: any) => console.error(error));

    }

    authenticate(userId, token) {
      console.log(userId, token);
      //this.api.authenticate()
      //  .subscribe(
      //      data => {
              this.loading.style.display = 'none';
              localForage.setItem(prodeUserKey, userId);
              this.setLoggedIn(true);
              this.router.navigate(['/dashboard']);
      //      },
      //      error => console.log(<any>error)
      //  );
    }

    logout() {
        let router = this.router;
        // remove user from local storage to log user out
        localForage.removeItem(prodeUserKey).then(err => {
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

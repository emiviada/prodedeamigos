import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';

import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { SpinnerService } from './spinner.service';
import { prodeUserKey } from '../global';

// https://github.com/localForage/localForage
import * as localForage from "localforage";

export interface LoggedInUser {
  id: number;
  profile_picture_url: string;
}

@Injectable()
export class AuthService {

    protected returnUrl: string;
    public userInitialized = new Subject();
    public user;

    // Create a stream of logged in status to communicate throughout app
    loggedIn: boolean;
    loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

    loading = document.getElementById('loading');

    constructor(
      private api: ApiService,
      private fb: FacebookService,
      private router: Router,
      private route: ActivatedRoute,
      private spinner: SpinnerService) {
        const initParams: InitParams = {
          appId: environment.facebook_app_id,
          xfbml: true,
          version: 'v2.5'
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
        let that = this;
        this.checkLoginStatus().subscribe((loggedInUser: LoggedInUser) => {
            let authenticated = (loggedInUser)? true : false;
            this.setLoggedIn(authenticated);
            if (authenticated) {
              that.user = loggedInUser;
              that.userInitialized.next(that.user);
            }
        });
    }

    loginWithFacebook(): void {
        const options: LoginOptions = {
          scope: 'public_profile,email'
        };

        this.spinner.show();
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
                            let profilePicture = data[0].profile_picture_url;
                            // If user exists, just update profile picture
                            this.fb.api('/' + fbId + '/picture?width=200')
                              .then(res => {
                                let picture_url = res.data.url;
                                let params = {'user': {
                                  'profilePictureUrl': picture_url
                                }};
                                this.api.editUser(userId, params)
                                .subscribe(
                                  data => {
                                    //console.log('User edited!');
                                  },
                                  error => { return Observable.throw(error); }
                                );
                              }).catch(error => { return Observable.throw(error); });

                            this.authenticate(userId, profilePicture, token);

                        } else { // Create the user
                          let fields = 'id,name,picture.width(200),email';
                          this.fb.api('/' + fbId + '?fields=' + fields)
                            .then(res => {
                              let picture_url = res.picture.data.url;
                              let params = {'user': {
                                'email': res.email,
                                'password': res.id,
                                'facebookId': res.id,
                                'username': res.name,
                                'profilePictureUrl': picture_url
                              }};
                              this.api.createUser(params)
                                .subscribe(
                                  data => {
                                    let p = data.split('/');
                                    let userId = p[3];
                                    this.authenticate(userId, picture_url, token);
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

    authenticate(userId, profilePictureUrl, token) {
      //console.log(userId, token);
      //this.api.authenticate()
      //  .subscribe(
      //      data => {
              // get return url from route parameters or default to '/'
              this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

              let loggedInUser = {id: userId, profile_picture_url: profilePictureUrl};
              localForage.setItem(prodeUserKey, loggedInUser);
              this.user = loggedInUser;
              this.setLoggedIn(true);
              this.spinner.hide();
              this.router.navigate([this.returnUrl]);
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

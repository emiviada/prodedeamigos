import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, LoggedInUser } from '../service/auth.service';
import { SpinnerService } from '../service/spinner.service';

@Component({
  templateUrl: './homepage.component.html'
})
export class HomepageComponent implements OnInit {

    constructor(private auth: AuthService, private router: Router, private spinner: SpinnerService) { }

    ngOnInit(): void {
        // If user is loggedIn, redirect to Dashboard
        this.auth.checkLoginStatus().subscribe((loggedInUser: LoggedInUser) => {
            let authenticated = (loggedInUser)? true : false;
            if (authenticated) {
                this.router.navigate(['/dashboard']);
            }
        });

        this.spinner.hide();
    }

    loginWithFacebook(): void {
        this.auth.loginWithFacebook();
    }
}

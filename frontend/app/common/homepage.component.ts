import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { SpinnerService } from '../service/spinner.service';

@Component({
  templateUrl: './homepage.component.html'
})
export class HomepageComponent {
    constructor(private auth: AuthService, private router: Router, private spinner: SpinnerService) {
        // If user is loggedIn, redirect to Dashboard
        this.auth.checkLoginStatus().subscribe(value => {
            let authenticated = (value)? true : false;
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IToasterConfig, ToasterConfig } from 'angular2-toaster';

import { AuthService } from './service/auth.service';
import { SpinnerService } from './service/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    public appToasterConfig: IToasterConfig = new ToasterConfig({
        animation: 'fade',
        timeout: 3000
    });

    constructor(private auth: AuthService, private router: Router) {}

    /**
     * isLoggedIn() function
     */
    isLoggedIn() {
        return this.auth.loggedIn;
    }

    /**
     * isHomepage() function
     */
    isHomepage(): boolean {
        let is = false;
        if (this.router.url.split("?")[0] === '/') {
          is = true;
        }
        return is;
    }

    /**
     * isTerms() function
     */
    isTerms(): boolean {
        let is = false;
        if (this.router.url.split("?")[0] === '/terminos') {
          is = true;
        }
        return is;
    }
}

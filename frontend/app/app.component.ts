import { Component, OnInit } from '@angular/core';
import { IToasterConfig, ToasterConfig } from 'angular2-toaster';

import { AuthService } from './service/auth.service';
import { SpinnerService } from './service/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    loading: boolean;

    private appToasterConfig: IToasterConfig = new ToasterConfig({
        animation: 'fade',
        timeout: 3000
    });

    constructor(private auth: AuthService, private spinner: SpinnerService) {
      this.loading = true;
    }

    ngOnInit(): void {
        this.spinner.loading.subscribe((val: boolean) => {
            this.loading = val;
        });
    }

    isLoggedIn() {
        return this.auth.loggedIn;
    }
}

import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  templateUrl: './homepage.component.html'
})
export class HomepageComponent {
    constructor(private auth: AuthService) { }

    loginWithFacebook(): void {
        this.auth.loginWithFacebook();
    }
}

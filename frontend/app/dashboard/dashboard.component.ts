import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(private auth: AuthService) { }

    logout(): void {
        this.auth.logout();
    }
}

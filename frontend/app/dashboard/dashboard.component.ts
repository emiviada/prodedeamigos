import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';

import { FantasyTournament } from '../model/fantasyTournament';
import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { LoaderState } from '../model/loader';
import { prodeUserKey } from '../global';


@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    loading: boolean = false;
    private subscription: Subscription;
    fantasyTournaments: FantasyTournament[];

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private spinner: SpinnerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.subscription = this.spinner.loaderState
            .subscribe((state: LoaderState) => {
                this.loading = state.loading;
            });
        this.spinner.show();
        if (this.auth.user) {
            this.getFantasyTournaments(this.auth.user);
        } else {
            this.auth.userInitialized.subscribe((user) => {
                this.getFantasyTournaments(user);
            });
        }
    }

    /*
     * getFantasyTournaments() Call API
     */
    getFantasyTournaments(user) {
        this.api.getFantasyTournaments(user.id).subscribe(
            data => {
                this.fantasyTournaments = data;
                this.spinner.hide();
            },
            error => {
                console.log(<any>error);
                this.spinner.hide();
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    viewFantasyTournament(slug: string): void {
        this.router.navigate(['/torneo/' + slug]);
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

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
        this.api.getFantasyTournaments(this.auth.userId).subscribe(
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

    playerLabel(value): string {
        let label = (value == 1)? 'Jugador' : 'Jugadores';
        return value + ' ' + label;
    }

    viewFantasyTournament(slug: string): void {
        this.router.navigate(['/torneo/' + slug]);
    }
}

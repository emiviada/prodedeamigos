import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FantasyTournament } from '../model/fantasyTournament';
import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { prodeUserKey } from '../global';
import { LoaderState } from '../model/loader';


@Component({
  templateUrl: './my_fantasy_tournaments.component.html'
})
export class MyFantasyTournamentsComponent implements OnInit {

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
        this.api.getFantasyTournaments(user.id, true).subscribe(
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

    playerLabel(value): string {
        let label = (value == 1)? 'Jugador' : 'Jugadores';
        return value + ' ' + label;
    }

    editFantasyTournament(slug: string): void {
        this.router.navigate(['/mis-torneos/' + slug]);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

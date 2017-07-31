import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FantasyTournament } from '../model/fantasyTournament';
import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { prodeUserKey } from '../global';

@Component({
  templateUrl: './my_fantasy_tournaments.component.html'
})
export class MyFantasyTournamentsComponent implements OnInit {

    loading: boolean;
    fantasyTournaments: FantasyTournament[];

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private spinner: SpinnerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.spinner.show();
        this.spinner.loading.subscribe((val: boolean) => {
            this.loading = val;
        });
        this.api.getFantasyTournaments(this.auth.userId, true).subscribe(
            data => {
                this.fantasyTournaments = data;
                this.loading = false;
                this.spinner.hide();
            },
            error => {
                console.log(<any>error);
                this.loading = false;
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
}
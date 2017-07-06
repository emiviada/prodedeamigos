import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { FantasyTournament } from '../model/fantasyTournament';
import { Game } from '../model/game';
import { prodeUserKey } from '../global';


@Component({
  templateUrl: './fantasy_tournament_detail.component.html'
})
export class FantasyTournamentDetailComponent implements OnInit {

    fantasyTournament: FantasyTournament;
    games: Game[];

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private spinner: SpinnerService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.spinner.show();
        this.route.params
            .switchMap((params: Params) =>
                this.api.getFantasyTournament(this.auth.userId, params['slug']))
                    .subscribe(
                        data => {
                            this.fantasyTournament = data[0];
                            this.spinner.hide();
                        },
                        error => {
                            console.log(<any>error);
                            this.spinner.hide();
                        }
                    );
        // Get Games
        this.route.params
            .switchMap((params: Params) =>
                this.api.getGames(this.auth.userId, params['slug']))
                    .subscribe(
                        data => {
                            this.games = data;
                            this.spinner.hide();
                        },
                        error => {
                            console.log(<any>error);
                            this.spinner.hide();
                        }
                    );
    }
}

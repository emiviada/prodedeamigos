import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { FantasyTournament } from '../model/fantasyTournament';
import { Game } from '../model/game';
import { Prediction } from '../model/prediction';
import { LoaderState } from '../model/loader';
import { prodeUserKey } from '../global';


@Component({
  templateUrl: './fantasy_tournament_detail.component.html'
})
export class FantasyTournamentDetailComponent implements OnInit {

    loading: boolean = false;
    private subscription: Subscription;
    fantasyTournament: FantasyTournament;
    games: Game[];
    nextGames: Game[] = [];
    finishedGames: Game[] = [];
    predictions: Prediction[];

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private spinner: SpinnerService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subscription = this.spinner.loaderState
            .subscribe((state: LoaderState) => {
                this.loading = state.loading;
            });
        this.spinner.show();
        if (this.auth.user) {
            this.getFantasyTournament(this.auth.user);
            this.getGames(this.auth.user);
            this.getPredictions(this.auth.user);
        } else {
            this.auth.userInitialized.subscribe((user) => {
                this.getFantasyTournament(user);
                this.getGames(user);
                this.getPredictions(user);
            });
        }
    }

    /*
     * getFantasyTournament() Call API
     */
    getFantasyTournament(user) {
        this.route.params
            .switchMap((params: Params) =>
                this.api.getFantasyTournament(user.id, params['slug']))
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
    }

    /*
     * getGames() Call API
     */
    getGames(user) {
        this.route.params
            .switchMap((params: Params) =>
                this.api.getGames(user.id, params['slug']))
                    .subscribe(
                        data => {
                            this.games = data;
                            this.games.map(game => {
                                if (game.finished) {
                                    this.finishedGames.unshift(game);
                                } else {
                                    this.nextGames.push(game);
                                }
                            });
                            this.spinner.hide();
                        },
                        error => {
                            console.log(<any>error);
                            this.spinner.hide();
                        }
                    );
    }

    /*
     * getPredictions() Call API
     */
    getPredictions(user) {
        this.route.params
            .switchMap((params: Params) =>
                this.api.getPredictions(user.id, params['slug']))
                    .subscribe(
                        data => {
                            this.predictions = data;
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
}

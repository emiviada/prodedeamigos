import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { FantasyTournament } from '../model/fantasyTournament';
import { Game } from '../model/game';
import { Prediction } from '../model/prediction';
import { LoaderState } from '../model/loader';
import { getDateTime, getPredictionPoints } from '../global';

@Component({
  templateUrl: './predictions_modal.component.html',
})
export class PredictionsModalComponent implements OnInit {

    loading: boolean = false;
    private subscription: Subscription;
    game: Game;
    fantasyTournament: FantasyTournament;
    predictions: Prediction[];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private spinner: SpinnerService,
        private api: ApiService
    ) { }

    /**
     * ngOnInit() lifecycle
     */
    ngOnInit(): void {
        this.game = this.data.game;
        this.fantasyTournament = this.data.fantasyTournament;
        // Get all game's predictions
        this.subscription = this.spinner.loaderState
            .subscribe((state: LoaderState) => {
                this.loading = state.loading;
            });
        this.spinner.show();
        this.api.getAllPredictionsByGame(this.fantasyTournament.id, this.game.id)
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

    /**
     * getDateTime() functions
     * Wrapper for global getDateTime()
     */
    getDateTime(datetime): string {
        return getDateTime(datetime);
    }

    /**
     * getPredictionPoints() function
     * Wrapper for global getPredictionPoints()
     */
    getPoints(prediction): number {
        return getPredictionPoints(this.fantasyTournament, this.game, prediction);
    }

    /**
     * ngOnDestroy() lifecycle
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

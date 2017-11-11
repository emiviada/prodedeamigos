import { Component, OnChanges, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { FantasyTournament } from '../model/fantasyTournament';
import { Game } from '../model/game';
import { Prediction } from '../model/prediction';
import { PredictionsModalComponent } from './predictions_modal.component';
import { monthLabels, getDateTime, getPredictionPoints } from '../global';

@Component({
  selector: 'result',
  templateUrl: './result.component.html'
})
export class ResultComponent implements OnChanges {

    @Input() fantasyTournament: FantasyTournament;
    @Input() game: Game;
    @Input() predictions: Prediction[];
    prediction: Prediction;
    points: number = 0;
    pointsClass: string = 'text-primary';

    constructor(public dialog: MatDialog) {}

    ngOnChanges(): void {
        if (this.predictions) {
            this.predictions.map(p => {
                if (p.game['id'] === this.game.id) {
                    this.prediction = p;
                }
            });
        }

        this._getPoints();
    }

    myBet(): string {
        let bet = 'x - x';
        if (this.prediction) {
            bet = this.prediction.goals_home + ' - ' + this.prediction.goals_away;
        }

        return bet;
    }

    _getPoints(): number {
        this.points = getPredictionPoints(this.fantasyTournament, this.game, this.prediction);

        if (this.points > 2) {
            this.pointsClass = 'text-success';
        }

        return this.points;
    }

    getDateTime(datetime): string {
        return getDateTime(datetime);
    }

    /**
     * seePredictions() function
     */
    seePredictions(): void {
        this.dialog.open(PredictionsModalComponent, {
            data: { fantasyTournament: this.fantasyTournament, game: this.game }
        });
    }
}

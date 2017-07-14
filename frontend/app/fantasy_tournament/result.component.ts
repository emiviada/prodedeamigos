import { Component, OnChanges, Input } from '@angular/core';

import { FantasyTournament } from '../model/fantasyTournament';
import { Game } from '../model/game';
import { Prediction } from '../model/prediction';
import { monthLabels, getDateTime } from '../global';

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

    constructor() {}

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
        if (this.fantasyTournament && this.game && this.prediction && this.prediction.processed) {
            if (this.prediction.hit) {
                this.points += this.fantasyTournament.points_per_game;
            }
            if (this.fantasyTournament.match_exact && this.prediction.hit_exact) {
                this.points += this.fantasyTournament.points_per_exact;
            }
        }

        if (this.points > 2) {
            this.pointsClass = 'text-success';
        }

        return this.points;
    }

    getDateTime(datetime): string {
        return getDateTime(datetime);
    }
}

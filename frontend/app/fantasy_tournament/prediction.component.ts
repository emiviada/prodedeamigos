import { Component, OnChanges, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import 'rxjs/add/operator/map';

import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { FantasyTournament } from '../model/fantasyTournament';
import { Game } from '../model/game';
import { Prediction } from '../model/prediction';
import { monthLabels, getDateTime } from '../global';

@Component({
  selector: 'prediction',
  templateUrl: './prediction.component.html'
})
export class PredictionComponent implements OnChanges {

    @Input() game: Game;
    @Input() fantasyTournament: FantasyTournament;
    @Input() predictions: Prediction[];
    prediction: Prediction;
    submitted: boolean = false;

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private spinner: SpinnerService,
        private toasterService: ToasterService) {
            this.prediction = new Prediction();
    }

    ngOnChanges(): void {
        if (this.predictions) {
            this.predictions.map(p => {
                if (p.game['id'] === this.game.id) {
                    this.prediction = p;
                }
            });
        }
    }

    save($event: any): void {
        this.submitted = true;
        if (this.prediction.id) { // Edit
            this._edit(this.prediction);
        } else { // New
            this.prediction.game = this.game;
            this._new(this.prediction);
        }
    }

    _edit(prediction: Prediction): void {
        this.spinner.show();
        this.api.editPrediction(this.auth.userId, this.fantasyTournament.slug, prediction)
            .subscribe(
                data => {
                    this.spinner.hide();
                    this.toasterService.pop('success', 'OK');
                    this.submitted = false;
                },
                error => {
                    console.log(<any>error);
                    this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                    this.spinner.hide();
                    this.submitted = false;
                }
            );
    }

    _new(prediction: Prediction): void {
        this.spinner.show();
        this.api.newPrediction(this.auth.userId, this.fantasyTournament.slug, prediction)
            .subscribe(
                data => {
                    let splitted = data.split('/');
                    this.prediction.id = splitted[splitted.length-1];
                    this.spinner.hide();
                    this.toasterService.pop('success', 'OK');
                    this.submitted = false;
                },
                error => {
                    console.log(<any>error);
                    this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                    this.spinner.hide();
                    this.submitted = false;
                }
            );
    }

    getDateTime(datetime): string {
        return getDateTime(datetime);
    }

    validateLength($event: any): void {
        let e = <KeyboardEvent> $event;
        if ($event.target.value.length > 0) {
            e.preventDefault();
        }
    }
}

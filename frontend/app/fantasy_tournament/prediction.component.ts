import { Component, OnChanges, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as moment from 'moment-timezone';

import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { FantasyTournament } from '../model/fantasyTournament';
import { Game } from '../model/game';
import { Prediction } from '../model/prediction';
import { monthLabels, TimeZone, getDateTime } from '../global';

@Component({
  selector: 'prediction',
  templateUrl: './prediction.component.html'
})
export class PredictionComponent implements OnChanges {

    @Input() game: Game;
    @Input() fantasyTournament: FantasyTournament;
    @Input() predictions: Prediction[];
    prediction: Prediction;
    expired: boolean = false;
    submitted: boolean = false;
    timeLeft: string = '';

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

            // Start timer to show time left
            let timer = Observable.timer(1000, 3000);
            timer.subscribe(t => this._timeLeft(t));
        }
    }

    /**
     * Calculates how much time is left to be able to submit a Prediction
     */
    _timeLeft(t): void {
        let gameDate = moment.tz(this.game.play_date_at, TimeZone),
            utc = moment.utc().valueOf(),
            now = moment(utc).tz('America/Argentina/Cordoba'),
            diff = gameDate.diff(now); // Different in miliseconds

        if (diff <= 0) {
            this.expired = true;
        } else {
            let seconds = Math.round(diff/1000);
            if (seconds > 60) {
                let minutes = Math.round(seconds/60);
                if (minutes > 99) {
                    let hours = Math.round(minutes/60);
                    if (hours > 24) {
                        let days = Math.round(hours/24);
                        this.timeLeft = 'Faltan ' + days + ' dias';
                    } else {
                        this.timeLeft = 'Faltan ' + hours + ' horas';
                    }
                } else {
                    this.timeLeft = 'Faltan ' + minutes + ' min.';
                }
            } else {
                this.timeLeft = 'Faltan ' + seconds + ' seg.';
            }
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

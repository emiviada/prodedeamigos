import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';

import { FantasyTournament } from '../model/fantasyTournament';
import { Tournament } from '../model/tournament';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';
import { SpinnerService } from '../service/spinner.service';
import { prodeUserKey } from '../global';

let loading = document.getElementById('loading');

@Component({
  templateUrl: './new_fantasy_tournament.component.html'
})
export class NewFantasyTournamentComponent implements OnInit {

    tournaments: Tournament[];
    pointsPerGameOptions = [2, 3, 4, 5];
    pointsPerExactOptions = [1, 2];
    model = new FantasyTournament;
    submitted = false;
    createdTournamentName = null;
    shareUrl = window.location.protocol + '//' + window.location.hostname + '/torneo';

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private spinner: SpinnerService,
        private location: Location,
        private toasterService: ToasterService
    ) { }

    ngOnInit(): void {
        this.spinner.show();
        this.api.getTournaments().subscribe(
            data => {
                this.tournaments = data;
                this.spinner.hide();
            },
            error => {
                console.log(<any>error);
                this.spinner.hide();
            }
        );
    };

    upsert(): void { // Create or Edit
        this.createdTournamentName = this.model.name;
        this.shareUrl += '/' + this.model.name;
        //console.log(JSON.stringify(this.model));

        this.spinner.show();
        this.api.createFantasyTournament(this.auth.userId, this.model).subscribe(
            data => {
                this.toasterService.pop('success', 'OK');
                this.spinner.hide();
                this.submitted = true;
            },
            error => {
                console.log(<any>error);
                this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                this.spinner.hide();
            }
        );

        this.model = new FantasyTournament;
    }

    onSubmit() { this.submitted = true; }

    cancel(): void {
        this.location.back();
    }
}

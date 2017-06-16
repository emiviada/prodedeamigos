import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';

import { FantasyTournament } from '../model/fantasyTournament';
import { Tournament } from '../model/tournament';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';
import { prodeUserKey } from '../global';

let loading = document.getElementById('loading');

@Component({
  templateUrl: './new_fantasy_tournament.component.html'
})
export class NewFantasyTournamentComponent implements OnInit {

    loading = true;
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
        private location: Location,
        private toasterService: ToasterService
    ) { }

    ngOnInit(): void {
        loading.style.display = 'block';
        this.api.getTournaments().subscribe(
            data => {
                this.tournaments = data;
                loading.style.display = 'none';
                this.loading = false;
            },
            error => {
                console.log(<any>error);
                loading.style.display = 'none';
                this.loading = false;
            }
        );
    };

    upsert(): void { // Create or Edit
        this.createdTournamentName = this.model.name;
        this.shareUrl += '/' + this.model.name;
        console.log(JSON.stringify(this.model));

        loading.style.display = 'block';
        this.api.createFantasyTournament(this.auth.userId, this.model).subscribe(
            data => {
                loading.style.display = 'none';
                this.toasterService.pop('success', 'OK');
                this.loading = false;
                this.submitted = true;
            },
            error => {
                console.log(<any>error);
                loading.style.display = 'none';
                this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                this.loading = false;
            }
        );

        this.model = new FantasyTournament;
    }

    onSubmit() { this.submitted = true; }

    cancel(): void {
        this.location.back();
    }
}

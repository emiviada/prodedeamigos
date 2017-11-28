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
    fantasyTournament: FantasyTournament;

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

        this.spinner.show();
        this.api.createFantasyTournament(this.auth.user.id, this.model).subscribe(
            data => {
                let locationHeader = data.headers.get('Location');
                let slug = locationHeader.split('/').slice(-1).pop();
                this.getFantasyTournament(this.auth.user, slug);
            },
            error => {
                console.log(<any>error);
                this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                this.spinner.hide();
            }
        );

        this.model = new FantasyTournament;
    }

    /**
     * getFantasyTournament() Call API
     */
    getFantasyTournament(user, slug) {
        this.api.getFantasyTournament(user.id, slug)
            .subscribe(
                data => {
                    this.fantasyTournament = data[0];
                    this.toasterService.pop('success', 'OK');
                    this.shareUrl += '/' + this.fantasyTournament.slug
                        + '/' + this.fantasyTournament.invitationHash;
                    this.submitted = true;
                    this.spinner.hide();
                },
                error => {
                    console.log(<any>error);
                    this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                    this.spinner.hide();
                }
            );
    }

    onSubmit() { this.submitted = true; }

    cancel(): void {
        this.location.back();
    }
}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';

import { FantasyTournament } from '../model/fantasyTournament';
import { Tournament } from '../model/tournament';
import { ApiService } from '../service/api.service';
import { prodeUserKey } from '../global';

let loading = document.getElementById('loading');

@Component({
  templateUrl: './new_fantasy_tournament.component.html'
})
export class NewFantasyTournamentComponent implements OnInit {

    loading = true;
    //tournaments = ['Torneo 1', 'Torneo 2'];
    tournaments: Tournament[];
    pointsPerGameOptions = [2, 3, 4, 5];
    pointsPerExactOptions = [1, 2];
    model = new FantasyTournament;
    submitted = false;

    constructor(
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
                console.log(this.tournaments);
            },
            error => {
                console.log(<any>error);
                loading.style.display = 'none';
                this.loading = false;
            }
        );
    };

    upsert(): void { // Create or Edit
        this.toasterService.pop('success', 'Congrats!', 'Body text');
        console.log(JSON.stringify(this.model));
        this.model = new FantasyTournament;
    }

    onSubmit() { this.submitted = true; }

    cancel(): void {
        this.location.back();
    }
}

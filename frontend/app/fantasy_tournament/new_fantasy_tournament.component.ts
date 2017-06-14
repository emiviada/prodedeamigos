import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { FantasyTournament } from '../model/fantasyTournament';

@Component({
  templateUrl: './new_fantasy_tournament.component.html'
})
export class NewFantasyTournamentComponent {

    tournaments = ['Torneo 1', 'Torneo 2'];
    pointsPerGameOptions = [2, 3, 4, 5];
    pointsPerExactOptions = [1, 2];
    model = new FantasyTournament;
    submitted = false;

    constructor(private location: Location) {
        this.model.pointsPerGame = 3;
    }

    upsert(): void { // Create or Edit
        alert(this.submitted);
        console.log(JSON.stringify(this.model));
        this.model = new FantasyTournament;
    }

    onSubmit() { this.submitted = true; }

    cancel(): void {
        this.location.back();
    }
}

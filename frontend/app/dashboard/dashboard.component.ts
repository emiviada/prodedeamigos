import { Component, OnInit } from '@angular/core';

// https://github.com/localForage/localForage
import * as localForage from "localforage";

import { FantasyTournament } from '../model/fantasyTournament';
import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { prodeUserKey } from '../global';

let loading = document.getElementById('loading');

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    loading = true;
    fantasyTournaments: FantasyTournament[];

    constructor(private auth: AuthService, private api: ApiService) {}

    ngOnInit(): void {
        loading.style.display = 'block';
        this.api.getFantasyTournaments(this.auth.userId).subscribe(
            data => {
                this.fantasyTournaments = data;
                loading.style.display = 'none';
                this.loading = false;
            },
            error => {
                console.log(<any>error);
                loading.style.display = 'none';
                this.loading = false;
            }
        );
    }

    playerLabel(value): string {
        let label = (value == 1)? 'Jugador' : 'Jugadores';
        return value + ' ' + label;
    }
}

import { Component, OnInit } from '@angular/core';

// https://github.com/localForage/localForage
import * as localForage from "localforage";

import { FantasyTournament } from '../model/fantasyTournament';
import { ApiService } from '../service/api.service';
import { prodeUserKey } from '../global';

let loading = document.getElementById('loading');

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    loading = true;
    fantasyTournaments: FantasyTournament[];

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        loading.style.display = 'block';
        localForage.getItem(prodeUserKey).then(userId => {
            this.api.getFantasyTournaments(userId)
                .subscribe(
                    data => {
                        this.fantasyTournaments = data;
                        loading.style.display = 'none';
                        this.loading = false;
                        console.log(this.fantasyTournaments);
                    },
                    error => {
                        console.log(<any>error);
                        loading.style.display = 'none';
                        this.loading = false;
                    }
                );
        });
    };
}

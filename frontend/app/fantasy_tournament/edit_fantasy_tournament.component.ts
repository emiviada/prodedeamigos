import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import 'rxjs/add/operator/switchMap';
import swal from 'sweetalert';

import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';
import { FantasyTournament } from '../model/fantasyTournament';
import { User } from '../model/user';


@Component({
  templateUrl: './edit_fantasy_tournament.component.html'
})
export class EditFantasyTournamentComponent implements OnInit {

    fantasyTournament: FantasyTournament;
    shareUrl: string = window.location.protocol + '//' + window.location.hostname;

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private spinner: SpinnerService,
        private router: Router,
        private route: ActivatedRoute,
        private toasterService: ToasterService
    ) {
        let _this = this;
        document.addEventListener('copy', function($event: any) {
            _this.copiedShareUrl();
        });
    }

    ngOnInit(): void {
        this.spinner.show();
        if (this.auth.user) {
            this.getFantasyTournament(this.auth.user);
        } else {
            this.auth.userInitialized.subscribe((user) => {
                this.getFantasyTournament(user);
            });
        }
    }

    /**
     * getFantasyTournament() Call API
     */
    getFantasyTournament(user) {
        this.route.params
            .switchMap((params: Params) =>
                this.api.getFantasyTournament(user.id, params['slug']))
                    .subscribe(
                        data => {
                            this.fantasyTournament = data[0];
                            this.shareUrl += '/torneo/' + this.fantasyTournament.slug
                                + '/' + this.fantasyTournament.invitationHash;
                            this.spinner.hide();
                        },
                        error => {
                            console.log(<any>error);
                            this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                            this.spinner.hide();
                        }
                    );
    }

    /**
     * Notify after Copy the shareUrl to clipboard
     */
     copiedShareUrl(): void {
         this.toasterService.pop('success', 'OK');
     }

    /**
     * Check if userId is the same as logged in user
     */
    isMyself(userId: number): boolean {
        return this.auth.user.id === userId;
    }

    /**
     * Removes a User from the fantasyTournament
     */
    removeUser($event: any, user: User): void {
        let _this = this;
        swal({
            title: "¿Estas seguro que deseas eliminar a " + user.username + "?",
            type: "error",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, por favor",
            closeOnConfirm: true,
            html: false
        }, function() {
              _this.spinner.show();
              _this.api.removeUserFromFantasyTournament(_this.auth.user.id, _this.fantasyTournament.slug, user.id)
                .subscribe(
                    data => {
                        _this.toasterService.pop('success', 'OK');
                        $event.target.parentElement.parentElement.parentElement.style.display = 'none';
                        _this.spinner.hide();
                    },
                    error => {
                        console.log(<any>error);
                        _this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                        _this.spinner.hide();
                    }
                );
        });
    }
}

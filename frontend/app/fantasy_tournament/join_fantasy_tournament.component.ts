import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToasterService } from 'angular2-toaster';

import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';
import { SpinnerService } from '../service/spinner.service';
import { LoaderState } from '../model/loader';


@Component({
    templateUrl: './join_fantasy_tournament.component.html'
})
export class JoinFantasyTournamentComponent implements OnInit {

    loading: boolean = false;
    private subscription: Subscription;

    constructor(
      private auth: AuthService,
      private api: ApiService,
      private router: Router,
      private route: ActivatedRoute,
      private spinner: SpinnerService,
      private toasterService: ToasterService
    ) {}

    ngOnInit() {
        this.subscription = this.spinner.loaderState
            .subscribe((state: LoaderState) => {
                this.loading = state.loading;
            });
        this.spinner.show();
        this.route.params
            .switchMap((params: Params) =>
                this.api.findFantasyTournamentByHash(params['invitation_hash']))
                    .subscribe(
                        data => {
                            let fantasyTournament = data[0];
                            this.api.joinToFantasyTournament(
                              fantasyTournament.owner.id,
                              fantasyTournament.slug,
                              this.auth.user.id
                            )
                            .subscribe(
                                data => {
                                    this.spinner.hide();
                                    this.toasterService.pop(
                                      'success',
                                      fantasyTournament.name,
                                      'Te has unido al torneo.'
                                    );
                                    this.router.navigate(['/dashboard']);
                                },
                                error => {
                                    console.log(<any>error);
                                    this.spinner.hide();
                                    this.toasterService.pop(
                                      'warning',
                                      fantasyTournament.name,
                                      'Ya estas participando de este torneo.'
                                    );
                                    this.router.navigate(['/dashboard']);
                                }
                            );
                        },
                        error => {
                            console.log(<any>error);
                            this.spinner.hide();
                            this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                            this.router.navigate(['/dashboard']);
                        }
                    );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

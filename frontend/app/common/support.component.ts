import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';

import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { SpinnerService } from '../service/spinner.service';


@Component({
  templateUrl: './support.component.html'
})
export class SupportComponent {

    model = { message: null };
    submitted = false;

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private location: Location,
        private toasterService: ToasterService,
        private spinner: SpinnerService
    ) { }

    /**
     * send() function
     * Send email
     */
    send(): void {
        let message = {
           text: this.model.message,
           to: "emjovi@gmail.com",
           subject: "Prode de Amigos | Soporte"
        };

        this.spinner.show();
        this.api.sendMessage(this.auth.user.id, message).subscribe(
            data => {
                this.toasterService.pop('success', 'OK', 'Mensaje enviado.');
                this.spinner.hide();
                this.submitted = true;
            },
            error => {
                console.log(<any>error);
                this.toasterService.pop('error', 'Error', 'Hubo un error. Intenta mas tarde.');
                this.spinner.hide();
            }
        );

        return;
    }

    /**
     * cancel() function
     */
    cancel(): void {
        this.location.back();
    }
}

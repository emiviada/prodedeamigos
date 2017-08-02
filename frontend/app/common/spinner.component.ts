import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SpinnerService } from '../service/spinner.service';
import { LoaderState } from '../model/loader';

@Component({
    selector: 'spinner-loading',
    templateUrl: 'spinner.component.html'
})
export class SpinnerComponent implements OnInit {
    loading = false;
    private subscription: Subscription;

    constructor(private spinner: SpinnerService) {}

    ngOnInit() {
        this.subscription = this.spinner.loaderState
            .subscribe((state: LoaderState) => {
                this.loading = state.loading;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

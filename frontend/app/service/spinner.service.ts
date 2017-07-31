import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerService {

    public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public isLoading: boolean = true;

    show(): void {
        if (!this.isLoading) {
            this.setLoadingValue(true);
        }
    }

    hide(): void {
        if (this.isLoading) {
            this.setLoadingValue(false);
        }
    }

    setLoadingValue(value: boolean) {
        this.loading.next(value);
        this.isLoading = value;
    }
}

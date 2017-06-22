import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerService {

    public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    show(): void {
        this.setLoadingValue(true);
    }

    hide(): void {
        this.setLoadingValue(false);
    }

    setLoadingValue(value: boolean) {
        this.loading.next(value);
    }
}

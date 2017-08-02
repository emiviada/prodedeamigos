import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoaderState } from '../model/loader';

@Injectable()
export class SpinnerService {

    private loaderSubject = new Subject<LoaderState>();
    loaderState = this.loaderSubject.asObservable();

    show(): void {
        this.setLoadingValue(true);
    }

    hide(): void {
        this.setLoadingValue(false);
    }

    setLoadingValue(value: boolean) {
        this.loaderSubject.next(<LoaderState>{loading: value});
    }
}

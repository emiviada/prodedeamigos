import { Component, Input } from '@angular/core';

import { Game } from '../model/game';
import { monthLabels } from '../global';

@Component({
  selector: 'prediction',
  templateUrl: './prediction.component.html'
})
export class PredictionComponent {

    @Input() game: Game;

    constructor() {}

    getDateTime(datetime): string {
        let d = new Date(datetime), hours = String(d.getHours()),
            mins = String(d.getMinutes()), dateString;

        hours = (hours.length > 1)? hours : '0'+hours;
        mins = (mins.length > 1)? mins : '0'+mins;

        dateString = d.getDate() + ' de ' + monthLabels[d.getMonth()] + ' - '
            + hours + ':' + mins + ' Hs.';

        return dateString;
    }

    validateLength($event: any): void {
        let e = <KeyboardEvent> $event;
        if ($event.target.value.length > 0) {
            e.preventDefault();
        }
    }
}

import { Component, Input } from '@angular/core';

import { Game } from '../model/game';
import { monthLabels } from '../global';

@Component({
  selector: 'result',
  templateUrl: './result.component.html'
})
export class ResultComponent {

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
}

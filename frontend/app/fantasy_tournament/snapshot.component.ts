import { Component, OnChanges, Input } from '@angular/core';

import { AuthService } from '../service/auth.service';
import { FantasyTournament } from '../model/fantasyTournament';

@Component({
  selector: 'snapshot',
  templateUrl: './snapshot.component.html'
})
export class SnapshotComponent {

    @Input() fantasyTournament: FantasyTournament;
    public position: number;
    public positionClass: string;
    public positionProgressClass: string;

    /**
     * constructor
     */
    constructor(private auth: AuthService) {}

    /**
     * ngOnChanges
     */
    ngOnChanges(): void {
        if (this.fantasyTournament) {
            let _this = this;
            this.fantasyTournament.memberships.forEach(function(m) {
                if (_this.auth.user.id === m.user.id) {
                    _this.position = m.position;
                    _this.positionClass = (m.position > 0 && m.position <= 3)? 'bg-strong-success' : 'bg-primary';
                    if (m.position === m.prev_position) {
                        _this.positionProgressClass = 'fa-minus';
                    } else {
                        _this.positionProgressClass = (m.position < m.prev_position)? 'fa-level-up' : 'fa-level-down';
                    }
                    return;
                }
            });
        }
    }

    /**
     * playerLabel
     */
    playerLabel(value): string {
        let label = (value == 1)? 'Jugador' : 'Jugadores';
        return value + ' ' + label;
    }
}

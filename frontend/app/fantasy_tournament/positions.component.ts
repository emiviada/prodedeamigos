import { Component, Input } from '@angular/core';

import { AuthService } from '../service/auth.service';
import { FantasyTournament } from '../model/fantasyTournament';

@Component({
  selector: 'positions',
  templateUrl: './positions.component.html'
})
export class PositionsComponent {

    @Input() fantasyTournament: FantasyTournament;

    constructor(private auth: AuthService) {}

    getPosition(index: number): string {
        let pos = String(index + 1);
        return (pos.length > 1)? pos : '0' + pos;
    }

    isMyself(userId: number): boolean {
        return this.auth.userId === userId;
    }

    getPosChange(membership): number {
        return Math.abs(membership.position-membership.prev_position);
    }

    getPosChangeIcon(membership): string {
        let icon;
        if (membership.position == membership.prev_position) {
            icon = 'fa-minus text-primary';
        } else if (membership.position < membership.prev_position) {
            icon = 'fa-arrow-up text-success';
        } else if (membership.position > membership.prev_position) {
            icon = 'fa-arrow-down text-danger';
        }

        return icon;
    }
}

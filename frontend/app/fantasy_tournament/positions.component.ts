import { Component, Input } from '@angular/core';

import { AuthService } from '../service/auth.service';

@Component({
  selector: 'positions',
  templateUrl: './positions.component.html'
})
export class PositionsComponent {

    @Input() fantasyTournament: {};

    constructor(private auth: AuthService) {}

    getPosition(index: number): string {
        let pos = String(index + 1);
        return (pos.length > 1)? pos : '0' + pos;
    }

    isMyself(userId: number): boolean {
        return this.auth.userId === userId;
    }
}

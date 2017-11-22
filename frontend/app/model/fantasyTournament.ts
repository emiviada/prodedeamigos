export class FantasyTournament {
  id: number;
  name: string;
  tournament: string;
  owner: {};
  pointsPerGame: number;
  matchExact: boolean;
  pointsPerExact: number;
  pictureUri: string;
  slug: string;
  invitationHash: string;
  memberships;

  constructor() {
      this.pointsPerGame = 3;
  }
}

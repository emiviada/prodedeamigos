export class FantasyTournament {
  id: number;
  name: string;
  tournament: string;
  pointsPerGame: number;
  matchExact: boolean;
  pointsPerExact: number;
  slug: string;

  constructor() {
      this.pointsPerGame = 3;
  }
}

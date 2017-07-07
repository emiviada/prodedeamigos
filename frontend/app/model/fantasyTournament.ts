export class FantasyTournament {
  id: number;
  name: string;
  tournament: string;
  owner: {};
  points_per_game: number;
  match_exact: boolean;
  points_per_exact: number;
  picture_uri: string;
  slug: string;
  memberships;

  constructor() {
      this.points_per_game = 3;
  }
}

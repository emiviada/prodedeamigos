export class Game {
  id: number;
  finished: boolean;
  play_date_at: string;
  team_home: {
      alias: string;
      flag_uri: string;
  };
  team_away: {
      alias: string;
      flag_uri: string;
  };
  tournament: {};
  goals_home;
  goals_away;
  stadium: string;
}

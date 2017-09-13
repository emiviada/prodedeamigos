import { Routes } from '@angular/router';

import { AuthGuard } from './service/auth.guard';
import { HomepageComponent } from './common/homepage.component';
import { TermsComponent } from './common/terms.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyFantasyTournamentsComponent } from './fantasy_tournament/my_fantasy_tournaments.component';
import { NewFantasyTournamentComponent } from './fantasy_tournament/new_fantasy_tournament.component';
import { EditFantasyTournamentComponent } from './fantasy_tournament/edit_fantasy_tournament.component';
import { FantasyTournamentDetailComponent } from './fantasy_tournament/fantasy_tournament_detail.component';
import { JoinFantasyTournamentComponent } from './fantasy_tournament/join_fantasy_tournament.component';
import { SupportComponent } from './common/support.component';
import { NotFoundComponent } from './common/notfound.component';

export const appRoutes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'terminos', component: TermsComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'mis-torneos', component: MyFantasyTournamentsComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'crear-torneo', component: NewFantasyTournamentComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'torneo/:slug', component: FantasyTournamentDetailComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'torneo/:slug/:invitation_hash', component: JoinFantasyTournamentComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'mis-torneos/:slug', component: EditFantasyTournamentComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'soporte', component: SupportComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

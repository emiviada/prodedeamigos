import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { AppShellModule } from '@angular/app-shell';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FacebookModule } from 'ngx-facebook';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { ToasterModule } from 'angular2-toaster';
import { ClipboardModule } from 'ngx-clipboard';

import { appRoutes } from './routes';
import { AuthGuard } from './service/auth.guard';
import { AuthService } from './service/auth.service';
import { ApiService } from './service/api.service';
import { SpinnerService } from './service/spinner.service';
import { AppComponent } from './app.component';
import { AppShellComponent } from './common/app_shell.component';
import { MenuComponent } from './common/menu.component';
import { SpinnerComponent } from './common/spinner.component';
import { HomepageComponent } from './common/homepage.component';
import { TermsComponent } from './common/terms.component';
import { NotFoundComponent } from './common/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyFantasyTournamentsComponent } from './fantasy_tournament/my_fantasy_tournaments.component';
import { NewFantasyTournamentComponent } from './fantasy_tournament/new_fantasy_tournament.component';
import { EditFantasyTournamentComponent } from './fantasy_tournament/edit_fantasy_tournament.component';
import { FantasyTournamentDetailComponent } from './fantasy_tournament/fantasy_tournament_detail.component';
import { JoinFantasyTournamentComponent } from './fantasy_tournament/join_fantasy_tournament.component';
import { PositionsComponent } from './fantasy_tournament/positions.component';
import { ResultComponent } from './fantasy_tournament/result.component';
import { PredictionComponent } from './fantasy_tournament/prediction.component';
import { SnapshotComponent } from './fantasy_tournament/snapshot.component';
import { PredictionsModalComponent } from './fantasy_tournament/predictions_modal.component';
import { SupportComponent } from './common/support.component';

@NgModule({
  declarations: [
    AppComponent, AppShellComponent, MenuComponent, SpinnerComponent, HomepageComponent, NotFoundComponent,
    DashboardComponent, NewFantasyTournamentComponent, FantasyTournamentDetailComponent, PositionsComponent,
    SupportComponent, ResultComponent, PredictionComponent, MyFantasyTournamentsComponent,
    EditFantasyTournamentComponent, JoinFantasyTournamentComponent, SnapshotComponent, PredictionsModalComponent,
    TermsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    //AppShellModule.runtime(),
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FacebookModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ToasterModule,
    ClipboardModule
  ],
  entryComponents: [
    PredictionsModalComponent
  ],
  providers: [
    AuthService, AuthGuard, ApiService, SpinnerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

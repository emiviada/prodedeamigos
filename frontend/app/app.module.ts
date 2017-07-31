import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FacebookModule } from 'ngx-facebook';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdTabsModule, MdProgressSpinnerModule } from '@angular/material';
import { ToasterModule } from 'angular2-toaster';
import { ClipboardModule } from 'ngx-clipboard';
//import * as localForage from "localforage";

import { appRoutes } from './routes';
import { AuthGuard } from './service/auth.guard';
import { AuthService } from './service/auth.service';
import { ApiService } from './service/api.service';
import { SpinnerService } from './service/spinner.service';
import { AppComponent } from './app.component';
import { MenuComponent } from './common/menu.component';
import { HomepageComponent } from './common/homepage.component';
import { NotFoundComponent } from './common/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyFantasyTournamentsComponent } from './fantasy_tournament/my_fantasy_tournaments.component';
import { NewFantasyTournamentComponent } from './fantasy_tournament/new_fantasy_tournament.component';
import { EditFantasyTournamentComponent } from './fantasy_tournament/edit_fantasy_tournament.component';
import { FantasyTournamentDetailComponent } from './fantasy_tournament/fantasy_tournament_detail.component';
import { PositionsComponent } from './fantasy_tournament/positions.component';
import { ResultComponent } from './fantasy_tournament/result.component';
import { PredictionComponent } from './fantasy_tournament/prediction.component';

@NgModule({
  declarations: [
    AppComponent, MenuComponent, HomepageComponent, NotFoundComponent, DashboardComponent,
    NewFantasyTournamentComponent, FantasyTournamentDetailComponent, PositionsComponent,
    ResultComponent, PredictionComponent, MyFantasyTournamentsComponent, EditFantasyTournamentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MdTabsModule,
    MdProgressSpinnerModule,
    FacebookModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ToasterModule,
    ClipboardModule
  ],
  providers: [
    AuthService, AuthGuard, ApiService, SpinnerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

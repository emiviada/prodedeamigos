import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FacebookModule } from 'ngx-facebook';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';

import { appRoutes } from './routes';
import { AuthGuard } from './service/auth.guard';
import { AuthService } from './service/auth.service';
import { ApiService } from './service/api.service';
import { AppComponent } from './app.component';
import { MenuComponent } from './common/menu.component';
import { HomepageComponent } from './common/homepage.component';
import { NotFoundComponent } from './common/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewFantasyTournamentComponent } from './fantasy_tournament/new_fantasy_tournament.component';
import { FantasyTournamentDetailComponent } from './fantasy_tournament/fantasy_tournament_detail.component';

@NgModule({
  declarations: [
    AppComponent, MenuComponent, HomepageComponent, NotFoundComponent, DashboardComponent,
    NewFantasyTournamentComponent, FantasyTournamentDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FacebookModule.forRoot(),
    FormsModule,
    HttpModule,
    ToasterModule
  ],
  providers: [
    AuthService, AuthGuard, ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

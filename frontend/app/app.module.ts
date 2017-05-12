import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FacebookModule } from 'ngx-facebook';

import { appRoutes } from './routes';
import { AuthGuard } from './service/auth.guard';
import { AuthService } from './service/auth.service';
import { AppComponent } from './app.component';
import { MenuComponent } from './common/menu.component';
import { HomepageComponent } from './common/homepage.component';
import { NotFoundComponent } from './common/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent, MenuComponent, HomepageComponent, NotFoundComponent, DashboardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FacebookModule.forRoot(),
    FormsModule,
    HttpModule
  ],
  providers: [
    AuthService, AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

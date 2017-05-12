import { Routes } from '@angular/router';

import { AuthGuard } from './service/auth.guard';
import { HomepageComponent } from './common/homepage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './common/notfound.component';

export const appRoutes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

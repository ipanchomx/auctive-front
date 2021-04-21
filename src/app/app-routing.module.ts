import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './global/guards/auth.guard';
import { UnAuthGuard } from './global/guards/un-auth.guard';
import { AuctionsComponent } from './pages/auctions/auctions.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [UnAuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [UnAuthGuard] },
  { path: 'auctions', component: AuctionsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  // { path: '**', component: Page404Component },
  // { path: '404', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


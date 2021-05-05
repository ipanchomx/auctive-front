import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './global/guards/auth.guard';
import { UnAuthGuard } from './global/guards/un-auth.guard';
import { AuctionDetailComponent } from './pages/auction-detail/auction-detail.component';
import { AuctionSubscriptionsComponent } from './pages/auction-subscriptions/auction-subscriptions.component';
import { AuctionsComponent } from './pages/auctions/auctions.component';
import { HomeComponent } from './pages/home/home.component';
import { MyAuctionsComponent } from './pages/my-auctions/my-auctions.component';
import { Page404Component } from './pages/page404/page404.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '404', component: Page404Component },
  { path: 'home', component: HomeComponent, canActivate: [UnAuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [UnAuthGuard] },
  { path: 'auctions', component: AuctionsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'my-auctions', component: MyAuctionsComponent, canActivate: [AuthGuard] },
  { path: 'my-auction-subscriptions', component: AuctionSubscriptionsComponent, canActivate: [AuthGuard] },
  { path: "auctions/:id", component: AuctionDetailComponent, canActivate: [AuthGuard]},
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


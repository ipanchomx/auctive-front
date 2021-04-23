import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { CountdownModule } from 'ngx-countdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { NavBarComponent } from './global/layouts/nav-bar/nav-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { AuctionsComponent } from './pages/auctions/auctions.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChangePhotoFormComponent } from './dialogs/change-photo-form/change-photo-form.component';
import { CreateVerificationFormComponent } from './dialogs/create-verification-form/create-verification-form.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuctionItemComponent } from './components/auction-item/auction-item.component';
import { AuctionSubscriptionsComponent } from './pages/auction-subscriptions/auction-subscriptions.component';
import { MyAuctionsComponent } from './pages/my-auctions/my-auctions.component';
import { CreateAuctionFormComponent } from './dialogs/create-auction-dialog/create-auction-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    NavBarComponent,
    HomeComponent,
    AuctionsComponent,
    SettingsComponent,
    ChangePhotoFormComponent,
    CreateVerificationFormComponent,
    SidebarComponent,
    AuctionItemComponent,
    AuctionSubscriptionsComponent,
    MyAuctionsComponent,
    CreateAuctionFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,  
    CountdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

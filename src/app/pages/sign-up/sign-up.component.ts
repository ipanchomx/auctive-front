import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SessionService } from 'src/app/global/services/session.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from 'src/app/global/services/auth.service';
import { Router } from '@angular/router';

import { SocketsService } from 'src/app/global/services/sockets.service';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { Auction } from 'src/app/global/models/auction.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private sessionService: SessionService, 
    private _snackBar: MatSnackBar, 
    private authService: AuthService, 
    private auctionService: AuctionsService,
    private router: Router, 
    private _socket: SocketsService
  ) { }

  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";


  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: this.comparePasswords.bind(this)
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  createUser() {
    if (this.signupForm.valid) {
      this.sessionService.signup(this.signupForm.getRawValue()).then(data => {
        const snack = this._snackBar.open("User successfully created", "Close", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        snack._dismissAfter(3000);
      }).catch(err => {
        console.error('Failed to sign user up ', err);
        const snack = this._snackBar.open(`Unable to sign up - ${err.error.message}`, "Close", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
      });
    }
  }


  comparePasswords() {
    if (!this.signupForm) { return null; }
    const values = this.signupForm.getRawValue();
    if (values.password === values.confirm) {
      return null;
    } else {
      return { mismatch: true }
    }
  }


  async login() {
    if (this.loginForm.valid) {
      try {
        const data = await this.sessionService.login(this.loginForm.getRawValue());
        this.authService.saveUserId(this.loginForm.getRawValue().email);
        this.authService.save(data.token)
        this._socket.connect(this.authService.get(), this.authService.getUserId());

        const myAuctionsRes: any = await this.auctionService.getMyAuctions();
        const myAuctions: Auction[] = myAuctionsRes.auctions;

        const auctionSubscriptionsIdsRes:any = await this.auctionService.getAuctionSubscriptions();

        const auctionSubscriptionIds: string[] = auctionSubscriptionsIdsRes.auctions.map((value: any)=>value.auctionId);

        const auctionSubsRes: any = await this.auctionService.getAuctionsByList(auctionSubscriptionIds);

        const auctionSubs: Auction[] = auctionSubsRes.auctions || [];

        const auctions = [...myAuctions, ...auctionSubs];

        this._socket.emit('subscribeToAuctions', {auctions});
        this.router.navigate(["/auctions"])

      } catch (error) {
      
        console.log(error);

        const snack = this._snackBar.open(`Unable to login - ${error.error.message}`, "Close", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        snack._dismissAfter(3000);
      }

    }
  }
}

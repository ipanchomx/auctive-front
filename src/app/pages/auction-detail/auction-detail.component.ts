import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { AuthService } from 'src/app/global/services/auth.service';
import { SocketsService } from 'src/app/global/services/sockets.service';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {

  userEmail: string;
  auctionId: string;
  auction: Auction;
  isLoading: boolean = false;
  end_timestamp: number;
  finished: boolean;
  diffDays: number;
  newBid: number;

  slides = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _sockets: SocketsService,
    private _auth: AuthService,
    private _auctions: AuctionsService
  ) { }

  ngOnInit(): void {
    this.userEmail = this._auth.getUserId();

    this._activatedRoute.params.subscribe(params => {
      if (this.auctionId) {
        this._sockets.emit('leaveAuction', { auctionId: this.auctionId });
      }
      this.auctionId = params.id;
      this._sockets.emit('joinAuction', { auctionId: params.id });
      this.getAuction(params.id);
    });

    this._sockets.on('newBid', (data: any) => {

    });

    this._sockets.on('buyNow', (data: any) => {

    });

  }

  ngOnDestroy(): void {
    if (this.auctionId) {
      this._sockets.emit('leaveAuction', { auctionId: this.auctionId });
    }
  }

  getAuction(id: string) {
    this.isLoading = true;
    this._auctions.getAuctionById(id)
      .then((response: any) => {
        this.auction = response.auction;
        this.slides = this.auction.product_img_urls;

        let now = new Date();
        let end_date = new Date(this.auction.end_date.toString());
        this.end_timestamp = end_date.getTime();
        const diffTime = end_date.getTime() - now.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        this.finished = diffTime <= 0;
        this.diffDays = diffDays;
      })
      .catch(console.log)
      .finally(() => {
        this.isLoading = false;
      })
  }

  makeBid() {

  }

  buyNow() {

  }

  subscribeToAuction() {
    this._sockets.emit('subscribeToAuction', {auctionId: this.auctionId});
  }

}

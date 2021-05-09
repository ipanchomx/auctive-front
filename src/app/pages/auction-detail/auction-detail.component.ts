import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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
  subscribed: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  processingBid: boolean = false;

  slides = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
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
      if (data.auctionId == this.auction.auction_id) {
        this.auction.current_price = data.bid;
        this.auction.current_bidder = data.current_bidder;
        this.processingBid = false;
        let message = "";

        if (data.current_bidder == this.userEmail) {
          message = "Successful bid";
        } else {
          message = "Another user has made a new bid"

        }
        const snack = this._snackBar.open(message, "Close", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        snack._dismissAfter(3000);
      }
    });

    this._sockets.on('unsuccessfulBid', (data: any) => {
      this.processingBid = false;
      const snack = this._snackBar.open(`Could not place bid`, "Close", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      snack._dismissAfter(3000);
    });

    this._sockets.on('unsuccessfulBuyNow', (data: any) => {
      this.processingBid = false;
      const snack = this._snackBar.open(`Could not buy product`, "Close", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      snack._dismissAfter(3000);
    });

    this._sockets.on('buyNow', (data: any) => {

      if (data.auctionId == this.auction.auction_id) {
        this.processingBid = false;
        this.auction.auction_status = "CLOSED";
        this.auction.status = "CLOSED";
        this.auction.bid_winner = data.bid_winner
        let message = "";
        if (data.bid_winner == this.userEmail) {
          message = "Congratulations. You won the bid.";
        } else {
          message = "Another user has paid the buy now price";
        }
        const snack = this._snackBar.open(message, "Close", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        snack._dismissAfter(3000);
      }


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

  placeBid() {
    this.processingBid = true;
    this._sockets.emit('newBid', { auctionId: this.auctionId, bid: this.newBid, auctionOwnerEmail: this.auction.owner_email });
  }

  buyNow() {
    this.processingBid = true;
    this._sockets.emit('buyNow', { auctionId: this.auctionId, auctionOwnerEmail: this.auction.owner_email });
  }

  subscribeToAuction() {
    this._sockets.emit('subscribeToAuction', { auctionId: this.auctionId });
    this.subscribed = true;
  }

}

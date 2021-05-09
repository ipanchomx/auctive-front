import { Component, OnInit } from '@angular/core';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateAuctionFormComponent } from 'src/app/dialogs/create-auction-dialog/create-auction-form.component';
import { AuthService } from 'src/app/global/services/auth.service';
import { SocketsService } from 'src/app/global/services/sockets.service';
import { element } from 'protractor';

@Component({
  selector: 'app-my-auctions',
  templateUrl: './my-auctions.component.html',
  styleUrls: ['./my-auctions.component.scss']
})
export class MyAuctionsComponent implements OnInit {

  auctions: Array<Auction>;
  isLoading: boolean = false;
  errorMessage: String = '';
  currentUser: String;

  constructor(
    private auctionsService: AuctionsService,
    private _matDialog: MatDialog,
    private authService: AuthService,
    private _sockets: SocketsService
  ) { }

  ngOnInit(): void {
    this.getMyAuctions();
    this.currentUser = this.authService.getUserId();

    this._sockets.on('newBid', this.checkIfUpdate);
    this._sockets.on('buyNow', this.checkIfUpdate);
    this._sockets.on('auctionClose', this.checkIfUpdate);

  }
  getMyAuctions() {
    this.isLoading = true;
    this.auctionsService.getMyAuctions().then((data: any) => {
      this.auctions = data.auctions;
      this.auctions.sort((a, b) => {
        const aStatus = a.status || a.auction_status;
        const bStatus = b.status || b.auction_status;

        if (aStatus == bStatus) {
          return a.end_date > b.end_date ? 1 : -1;
        }
        return (aStatus == "OPEN" ? 1 : 0);
      });
      this.auctions.forEach((element: Auction) => {
        this._sockets.emit('joinAuction', { auctionId: element.auction_id });
      });

      this.isLoading = false;
      this.errorMessage = "";
    }).catch((err => {
      this.auctions = [];
      this.errorMessage = "Could not find auctions";
      this.isLoading = false;
    }))
  }

  launchCreateAuctionDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "300";
    dialogConfig.width = "40%"
    dialogConfig.minWidth = "360px";
    dialogConfig.minHeight = "700px"
    dialogConfig.data = {
    }

    const dialogRef = this._matDialog.open(CreateAuctionFormComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) this.getMyAuctions();
      });
  }

  checkIfUpdate = (data) => {
    if(this.auctions && this.auctions.length){
      let auctionIdx = this.auctions.findIndex((element) => element.auction_id == data.auctionId);
      if (auctionIdx != -1) {
        this.getMyAuctions();
      }
    }
  }
}

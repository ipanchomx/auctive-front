import { Component, OnInit } from '@angular/core';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateAuctionFormComponent } from 'src/app/dialogs/create-auction-dialog/create-auction-form.component';
import { AuthService } from 'src/app/global/services/auth.service';

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getMyAuctions();
    this.currentUser = this.authService.getUserId();
  }

  getMyAuctions() {
    this.isLoading = true;
    this.auctionsService.getMyAuctions().then((data:any) => {
      this.auctions = data.auctions;
      this.auctions.sort((a, b) => a.end_date > b.end_date ? 1 : -1);
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
        if(result) this.getMyAuctions();
      });
  }
}

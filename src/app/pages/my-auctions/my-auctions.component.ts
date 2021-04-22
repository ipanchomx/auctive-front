import { Component, OnInit } from '@angular/core';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';

@Component({
  selector: 'app-my-auctions',
  templateUrl: './my-auctions.component.html',
  styleUrls: ['./my-auctions.component.scss']
})
export class MyAuctionsComponent implements OnInit {

  auctions: Array<Auction>;
  isLoading: boolean = false;
  errorMessage: String = '';
  
  constructor(
    private auctionsService: AuctionsService
  ) { }

  ngOnInit(): void {
    this.getMyAuctions();
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
}

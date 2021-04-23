import { Component, OnInit } from '@angular/core';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { AuthService } from 'src/app/global/services/auth.service';

@Component({
  selector: 'app-auction-subscriptions',
  templateUrl: './auction-subscriptions.component.html',
  styleUrls: ['./auction-subscriptions.component.scss']
})
export class AuctionSubscriptionsComponent implements OnInit {

  auctions: Array<Auction>;
  isLoading: boolean = false;
  errorMessage: String = '';
  currentUser: String;
  
  constructor(
    private auctionsService: AuctionsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getMySubscriptionsAuctions();
    this.currentUser = this.authService.getUserId();
  }

  getMySubscriptionsAuctions() {
    this.isLoading = true;
    this.errorMessage = "";
    this.auctionsService.getAuctionSubscriptions().then((resp:any) => {
      let auctionIds = resp.auctions;
      return auctionIds.map((value:any) =>{
        return `${value.auctionId}`
      })

    })
    .then(auctionIds =>{
      if(!auctionIds.length) return [];
      return this.auctionsService.getAuctionsByList(auctionIds)
    })
    .then((auctionsList:any) => {
      this.auctions = auctionsList.auctions || [];
      this.auctions.sort((a, b) => a.end_date > b.end_date ? 1 : -1);
      this.isLoading = false;
    })
    .catch(error => {
      console.log(error);
      this.auctions = [];
      this.errorMessage = "Could not find auctions";
      this.isLoading = false;
    })
  }

}

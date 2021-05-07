import { Component, OnInit } from '@angular/core';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { AuthService } from 'src/app/global/services/auth.service';
import { SocketsService } from 'src/app/global/services/sockets.service';

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
  selectedAuctions: Object = {};
  selectedAuctionsSize = 0;

  constructor(
    private auctionsService: AuctionsService,
    private authService: AuthService,
    private socketService: SocketsService
  ) { }

  ngOnInit(): void {
    this.getMyAuctionSubscriptions();
    this.currentUser = this.authService.getUserId();
  }

  selectAuction(selected: boolean, auction: Auction) {
    if (selected) {
      this.selectedAuctions[auction.auction_id.toString()] = auction;
      this.selectedAuctionsSize++;
      return;
    }
    delete this.selectedAuctions[auction.auction_id.toString()];
    this.selectedAuctionsSize--;
  }

  async deleteMyAuctions() {
    const auctionPromises: Promise<any>[] = [];
    const auctionIds: String[] = [];

    try {
      for(let item of Object.values(this.selectedAuctions)){
        const auction: Auction = item;
        auctionIds.push(auction.auction_id);
        auctionPromises.push(this.auctionsService.removeAuctionSubscription(auction.auction_id));
      }
      await Promise.all(auctionPromises);

      this.socketService.emit("leaveAuctions", {auctions: auctionIds});

      this.selectedAuctions = {};
      this.selectedAuctionsSize = 0;
      this.getMyAuctionSubscriptions();

      
    } catch (error) {
      console.log(error);
    }

  }


  getMyAuctionSubscriptions() {
    this.isLoading = true;
    this.errorMessage = "";
    this.auctionsService.getAuctionSubscriptions().then((resp: any) => {
      let auctionIds = resp.auctions;
      return auctionIds.map((value: any) => {
        return `${value.auctionId}`
      })

    })
      .then(auctionIds => {
        console.log(auctionIds);
        if (!auctionIds.length) return [];
        return this.auctionsService.getAuctionsByList(auctionIds)
      })
      .then((auctionsList: any) => {
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

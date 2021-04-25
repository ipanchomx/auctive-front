import { Component } from '@angular/core';
import { Auction } from './global/models/auction.model';
import { AuctionsService } from './global/services/auctions.service';
import { AuthService } from './global/services/auth.service';
import { SocketsService } from './global/services/sockets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'auctive-front';

  constructor(
    private authService: AuthService,
    private _socket: SocketsService,
    private auctionService: AuctionsService,
  ) {
    if (this.authService.isLoggedIn()) {
      this._socket.connect(this.authService.get(), this.authService.getUserId());
      this.initialize();
    }
  }

  async initialize() {

    const myAuctionsRes: any = await this.auctionService.getMyAuctions();
    const myAuctions: Auction[] = myAuctionsRes.auctions;

    const auctionSubscriptionsIdsRes: any = await this.auctionService.getAuctionSubscriptions();

    const auctionSubscriptionIds: string[] = auctionSubscriptionsIdsRes.auctions.map((value: any) => value.auctionId);

    const auctionSubsRes: any = await this.auctionService.getAuctionsByList(auctionSubscriptionIds);

    const auctionSubs: Auction[] = auctionSubsRes.auctions || [];

    const auctions = [...myAuctions, ...auctionSubs];

    this._socket.emit('subscribeToAuctions', { auctions });
    console.log("Subscribed to all auctions");
  }
}




import { Component, Input, OnInit } from '@angular/core';
import { Auction } from 'src/app/global/models/auction.model';

@Component({
  selector: 'app-auction-item',
  templateUrl: './auction-item.component.html',
  styleUrls: ['./auction-item.component.scss']
})
export class AuctionItemComponent implements OnInit {
  @Input() auction: Auction;
  auctionInfo: any;
  constructor() { }

  ngOnInit(): void {
    this.auctionInfo = this.auction;
    let now = new Date();
    let end_date = new Date(this.auctionInfo.end_date);
    this.auctionInfo.end_timestamp = end_date.getTime();
    const diffTime = end_date.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    this.auctionInfo.finished = diffTime<=0;
    this.auctionInfo.days = diffDays;
  }

}

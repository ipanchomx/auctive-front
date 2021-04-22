import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { AuthService } from 'src/app/global/services/auth.service';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss']
})
export class AuctionsComponent implements OnInit {

  auctions: Array<Auction>;
  isLoading: boolean = false;
  errorMessage: String = '';
  currentUser: String;

  constructor(private route: ActivatedRoute, private auctionsService: AuctionsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserId()
    this.route.queryParams.subscribe(params => {
      const query = params.q || '';
      const category = params.category;
      this.isLoading = true;
      this.auctionsService.searchAuctions(query, category)
        .then((response: any) => {
          this.auctions = response.auctions;
          this.auctions.sort((a, b) => a.end_date > b.end_date ? 1 : -1);
          this.isLoading = false;
          this.errorMessage = "";
        })
        .catch(resp => {
          this.auctions = [];
          this.errorMessage = "Could not find auctions";
          this.isLoading = false;
        });

    });
  }

}

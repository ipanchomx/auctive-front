import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auction } from 'src/app/global/models/auction.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { AuthService } from 'src/app/global/services/auth.service';
import { CategoryService } from 'src/app/global/services/category.service';

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
  categories: string[] = ["Ninguna"];
  minPrice: number;
  maxPrice: number;
  categorySelected: String;
  priceMax: number;
  priceMin: number;
  selectedValue: String;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auctionsService: AuctionsService,
    private authService: AuthService, 
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserId()
    this.route.queryParams.subscribe(params => {
      const query = params.q || '';
      this.minPrice = params.minPrice;
      this.maxPrice = params.maxPrice;
      this.categorySelected = params.category
      this.isLoading = true;
      this.auctionsService.searchAuctions(query, this.categorySelected, this.minPrice, this.maxPrice)
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

    this.getCategories();
  }

  getCategories():void {
    this.categoryService.getCategories().then((resp:any) => {
      let categoriesList = resp.categories;
      categoriesList.forEach((element:any) => {
        this.categories.push(element.category_name);
      });
    })
  }

  changeOnSearchFilters() {
    if(this.categorySelected == "Ninguna") this.selectedValue = undefined;
    else this.selectedValue = this.categorySelected;
    return this.router.navigate(['/auctions'], { queryParamsHandling: "merge", queryParams: { category: this.selectedValue, minPrice: this.minPrice, maxPrice: this.maxPrice} });
  }
}

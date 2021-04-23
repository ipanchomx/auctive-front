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
  categories: string[] = [];
  min_price: number;
  max_price: number;
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

    this.getCategories();
  }

  getCategories():void {
    this.categoryService.getCategories().then((resp:any) => {
      let categoriesList = resp.categories;
      categoriesList = categoriesList.map((item) => {
        return item.category_name;
      });
      this.categories = categoriesList;
    })
  }

  changeOnSearchFilters() {
    // this.router.navigate(['/auctions'], { queryParamsHandling: "merge", queryParams: { q: this.searchQuery } })

    if(this.selectedValue) return this.router.navigate(['/auctions'], { queryParamsHandling: "merge", queryParams: { category: this.selectedValue } })

    let priceMax = this.max_price | 10000000;
    let priceMin = this.min_price | 0;

    // TODO: Hacer en el back una función que reciba category, price min y max, pero establecer valores por default en caso de que uno sea undefined.
    
    console.log("max_price: ",this.max_price);
    console.log("min_price: ",this.min_price);
    console.log("category selected: ",this.selectedValue);
    console.log("max_price bool: ", this.max_price != undefined);
    console.log("min_price bool: ", this.min_price != undefined);
    console.log("category selected bool: ", this.selectedValue != undefined);

    
  }
}

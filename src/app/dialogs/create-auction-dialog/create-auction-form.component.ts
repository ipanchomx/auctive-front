import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketsService } from 'src/app/global/services/sockets.service';
import { CategoryService } from 'src/app/global/services/category.service';
import { ImagesService } from 'src/app/global/services/images.service';
import { ImageAsset } from 'src/app/global/models/image-asset.model';
import { AuctionsService } from 'src/app/global/services/auctions.service';
import { AuctionRequest, ImageRequest } from 'src/app/global/models/auction-request.model';
import { Auction } from 'src/app/global/models/auction.model';


@Component({
  selector: 'app-upload-file-form',
  templateUrl: './create-auction-form.component.html',
  styleUrls: ['./create-auction-form.component.scss']
})
export class CreateAuctionFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<CreateAuctionFormComponent>,
    private _auctionService: AuctionsService,
    private _snackBar: MatSnackBar,
    private _sockets: SocketsService,
    private _categoryService: CategoryService,
    private _imageService: ImagesService
  ) { }

  title: string = '';
  description: string = '';

  files: File[];
  images: ImageAsset[] = [];
  categories: any;
  category: string = '';

  duration: number = 1;

  startingPrice: number = 100;
  buyNowPrice: number = 150;

  tags: any[] = [];
  tagInput: string = '';

  inProgress: boolean = false;

  ngOnInit(): void {
    this.getCategories();
  }

  addTagToList() {
    if (!this.tagInput) {
      return
    }
    this.tags.push(this.tagInput);
    this.tagInput = '';
  }

  async onFileChange(event) {
    this.files = event.target.files;
    this.images = await this._imageService.processMultipleImages(event.target.files);
  }

  remove(idx: number) {
    this.tags.splice(idx, 1);
  }

  getCategories(): void {
    this._categoryService.getCategories().then((resp: any) => {
      let categoriesList = resp.categories;
      categoriesList = categoriesList.map((item) => {
        return item.category_name;
      });
      this.categories = categoriesList;
    })
  }

  createAuction() {

    this.inProgress = true;

    let imageBodies: ImageRequest[] = this.images.map(image => {
      let img: ImageRequest = {
        mime: image.file.type,
        image: image.src
      }

      return img;
    });

    let auctionRequest: AuctionRequest = {
      buy_now_price: this.buyNowPrice,
      category: this.category,
      description: this.description,
      title: this.title,
      duration: this.duration,
      images: imageBodies,
      starting_price: this.startingPrice,
      tags: this.tags || []
    }
    this._auctionService.createAuction(auctionRequest)
      .then(res => {
        this.inProgress = false;
        const auction: Auction = res.auction;
        this._sockets.emit("scheduleAuction", {auctionId: auction.auction_id, endDate: auction.end_date, auctionOwnerEmail: auction.owner_email})
        this._dialogRef.close(res.auction);
        const snackbarRef = this._snackBar.open("File uploaded successfully", "Close", {
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        snackbarRef._dismissAfter(3000);
      })
      .catch(res => {
        this.inProgress = false;
        console.log(res)
        const snackbarRef = this._snackBar.open(`Unable to Upload File - ${''}`, "Close", {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            })
      
          snackbarRef._dismissAfter(3000);
      })

  }

  onClose() {
    this._dialogRef.close();
  }

}

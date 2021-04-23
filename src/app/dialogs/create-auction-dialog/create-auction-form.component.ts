import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketsService } from 'src/app/global/services/sockets.service';
import { CategoryService } from 'src/app/global/services/category.service';
import { ImagesService } from 'src/app/global/services/images.service';
import { ImageAsset } from 'src/app/global/models/image-asset.model';


@Component({
  selector: 'app-upload-file-form',
  templateUrl: './create-auction-form.component.html',
  styleUrls: ['./create-auction-form.component.scss']
})
export class CreateAuctionFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<CreateAuctionFormComponent>,
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
  progress: number = 0;

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
    console.log("IMGS");
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
    // let form = new FormData();
    // form.append('extension', this.extension);
    // form.append('needsVerification', this.needsVerification.toString());
    // form.append('sharedWith', JSON.stringify(this.tags));
    // form.append('file', this.file, this.fileName);
    // form.append('path', this.data.path);
    this.inProgress = true;

    // this._files.upload(form).subscribe(event => {
    //   if (event.type === HttpEventType.UploadProgress) {
    //     this.progress = event.loaded / event.total;
    //   } else if (event.type === HttpEventType.Response) {
    //     this._dialogRef.close();
    //     this.progress = 0;
    //     this.inProgress = false;

    //     const snackbarRef = this._snackBar.open("File uploaded successfully", "Close", {
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top'
    //     })
    //     snackbarRef._dismissAfter(3000);
    //     const file: any = event.body;
    //     this._sockets.emit('notification', {file: file, sharedWith: file.sharedWith, type: "share"});

    //   }
    // }, error => {
    //   console.log(error);
    //   this.inProgress = false;
    //   const snackbarRef = this._snackBar.open(`Unable to Upload File - ${error.error.message}`, "Close", {
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top'
    //   })

    // snackbarRef._dismissAfter(3000);
    // })

  }

  onClose() {
    this._dialogRef.close();
  }

}

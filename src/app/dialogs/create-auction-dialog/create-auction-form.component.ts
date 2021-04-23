import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

import { HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketsService } from 'src/app/global/services/sockets.service';
import { CategoryService } from 'src/app/global/services/category.service';


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
    private categoryService: CategoryService
    ) { }

  files: File[];
  categories: any;
  needsVerification = false;
  users: any[];
  tags: any[] = [];
  userSearchInput: string = '';
  shareWithInp: string = '';
  category: string = '';
  currentUser: any;
  subject: BehaviorSubject<string> = new BehaviorSubject('');
  inProgress: boolean = false;
  progress: number = 0;

  ngOnInit(): void {
    this.getCategories();
  }

  selectCurrentUser(user: any) {
    this.currentUser = user;
  }

  addUserToSharedList() {
    if (!this.category || !this.currentUser) {
      return
    }
    this.tags.push({ ...this.currentUser, category: this.category });
    this.currentUser = null;
    this.category = 'read';
    this.shareWithInp = '';
    this.users = [];
  }

  displayFn(user: any) {
    return user && user.email;
  }



  onFileChange(event) {
    this.files = event.target.files;
  }

  searchUsers(e) {
    this.subject.next(e.target.value)
  }

  remove(idx: number) {
    this.tags.splice(idx, 1);
  }

  getCategories():void {
    this.categoryService.getCategories().then((resp:any) => {
      console.log(resp);
      let categoriesList = resp.categories;
      categoriesList = categoriesList.map((item) => {
        return item.category_name;
      });
      this.categories = categoriesList;
    })
  }

  uploadFile() {
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

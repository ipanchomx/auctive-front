import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { UserService } from 'src/app/global/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagesService } from 'src/app/global/services/images.service';
import { ImageAsset } from 'src/app/global/models/image-asset.model';

@Component({
  selector: 'app-change-photo-form',
  templateUrl: './change-photo-form.component.html',
  styleUrls: ['./change-photo-form.component.scss']
})
export class ChangePhotoFormComponent implements OnInit {
  file: File;
  fileName: string = '';
  extension: string = '';
  
  inProgress: boolean = false;
  progress: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<ChangePhotoFormComponent>,
    private _user: UserService,
    private _snackBar: MatSnackBar,
    private imageService:ImagesService) { }

  ngOnInit(): void {
  }

  onClose() {
    this._dialogRef.close();
  }


  onFileChange(event) {
    this.file = <File>event.target.files[0];
    if(!this.file.type.startsWith('image')){
      const snack = this._snackBar.open(`Invalid file type`, "Close", {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })

      snack._dismissAfter(3000);
      return;
    }
    if (this.file) {
      const fileExtIndex = this.file.name.lastIndexOf('.');
      this.fileName = this.file.name.slice(0, fileExtIndex);
      this.extension = this.file.name.slice(fileExtIndex);
    }
  }
  
  async changePhoto ()  {
    try {
      this.inProgress = true;

      let imageAsset:ImageAsset = await this.imageService.processSingleImage(this.file);
      await this._user.changePhoto(imageAsset);

      this.inProgress = false;
      const snack = this._snackBar.open("Profile pic updated successfully", "Close", {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })

      snack._dismissAfter(3000);
      this.onClose();

    } catch (error) {
      console.log(error)
      const snack = this._snackBar.open(`Unable to Update Profile pic - ${error.error.message}`, "Close", {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })

      snack._dismissAfter(3000);
    }

  }
}

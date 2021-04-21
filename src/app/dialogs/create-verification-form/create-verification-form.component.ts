import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { UserService } from 'src/app/global/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagesService } from 'src/app/global/services/images.service';
import { ImageAsset } from 'src/app/global/models/image-asset.model';

@Component({
  selector: 'app-create-verification-form',
  templateUrl: './create-verification-form.component.html',
  styleUrls: ['./create-verification-form.component.scss']
})
export class CreateVerificationFormComponent implements OnInit {
  file: File;
  fileName: string = '';
  extension: string = '';
  
  inProgress: boolean = false;
  progress: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<CreateVerificationFormComponent>,
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
  
  async createVerificationRequest ()  {
    try {
      this.inProgress = true;

      let imageAsset:ImageAsset = await this.imageService.processSingleImage(this.file);
      const response:any = await this._user.createVerificationRequest(imageAsset);

      if(response.statusCode!=200) throw new Error(response.body.message);
      this.inProgress = false;
      const snack = this._snackBar.open("Verification request successfully", "Close", {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })

      snack._dismissAfter(3000);
      this.onClose();

    } catch (error) {
      console.log(error)
      const snack = this._snackBar.open(`Unable to make verification request - ${error.error.message}`, "Close", {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })

      snack._dismissAfter(3000);
    }

  }
}

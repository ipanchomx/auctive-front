import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/global/services/auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


import { ChangePhotoFormComponent } from 'src/app/dialogs/change-photo-form/change-photo-form.component'
import { SocketsService } from 'src/app/global/services/sockets.service';

import { UserService } from 'src/app/global/services/user.service';
import { CreateVerificationFormComponent } from 'src/app/dialogs/create-verification-form/create-verification-form.component';
import { User } from 'src/app/global/models/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  passwordForm: FormGroup;
  editableName: boolean = false;
  nameError: boolean = false;
  showForm = true;
  editablePhone: boolean = false;
  phoneError: boolean = false;
  isLoading:boolean =  true;

  userId: string;

  userInfo: User ;

  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private socketsService: SocketsService,
    private _matDialog: MatDialog,
    private _user: UserService,
    private _socketService: SocketsService
  ) { }


  ngOnInit(): void {
    this._socketService.on('verificationUpdate', data =>{
      this.getUserInfo();
      const snack = this._snackBar.open(data.message, "Close", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      snack._dismissAfter(3000);
    })
    this.passwordForm = this.formBuilder.group({
      current: ['', Validators.required],
      new: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: this.comparePasswords.bind(this)
    })
    this.userId = this.authService.getUserId();

    this.socketsService.on("verificationUpdate", (data:any) => {
      this.getUserInfo();
      const snack = this._snackBar.open(data.message, "Close", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      snack._dismissAfter(3000);
    });
    this.getUserInfo();

  }

  changePassword(): void {

    if (this.passwordForm.valid) {
      const values = this.passwordForm.getRawValue();
      let obj = {
        currentPassword: values.current,
        newPassword: values.new
      };

      this._user.changePassword(obj)
        .then(msg => {
          const snack = this._snackBar.open(msg.message, "Close", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          })
          snack._dismissAfter(3000);
          this.passwordForm.reset();
          this.showForm = false;
          setTimeout(() => this.showForm = true, 250);
        })
        .catch(err => {
          const snack = this._snackBar.open(err.error.message, "Close", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          })
          snack._dismissAfter(3000);
        })

    } else {
      const snack = this._snackBar.open("Invalid form", "Close", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      snack._dismissAfter(3000);
    }
  }

  comparePasswords() {
    if (!this.passwordForm) { return null; }
    const values = this.passwordForm.getRawValue();
    if (values.new === values.confirm) {
      return null;
    } else {
      return { mismatch: true }
    }
  }

  changePhoto() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "300";
    dialogConfig.width = "40%"
    dialogConfig.minWidth = "360px";
    dialogConfig.minHeight = "300px"
    dialogConfig.data = {
    }

    const dialogRef = this._matDialog.open(ChangePhotoFormComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        this.getUserInfo();
      });
  }

  getUserInfo() {
    this.isLoading = true;
    this._user.getUserInfo(this.userId).then((data:any) => {
      this.userInfo = data.user;
      this.userInfo.image_url = this.userInfo.image_url || "/assets/images/default-profile-pic.jpg";
      this.isLoading = false;
    })
  }

  toggleEditablePhone(): void {
    if (this.editablePhone) {
      if (!this.userInfo.phone_number) {
        this.phoneError = true
        return
      } else {
        this.phoneError = false;
        this._user.changePhoneNumber(this.userInfo.phone_number)
          .then(msg => {
            console.log(msg);
            const snack = this._snackBar.open(msg.message, "Close", {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            })
            snack._dismissAfter(3000);
          })
          .catch(err => {
            console.log(err);
            const snack = this._snackBar.open(err.error.message, "Close", {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            })
            snack._dismissAfter(3000);
            this.userInfo.phone_number = undefined;
          })
      }
    }
    this.editablePhone = !this.editablePhone;
  }


  activateSMSNotifications() {
    if (this.userInfo.phone_number) {
      this._user.activateSMSNotifications()
        .then((res: any) => {
          this.userInfo.notifications_enabled = true;
          const snack = this._snackBar.open(res.data.message, "Close", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          })
          snack._dismissAfter(3000);
        })
        .catch(err => {
          const snack = this._snackBar.open(err.error.message, "Close", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          })
          snack._dismissAfter(3000);
        });
    } else {
      const snack = this._snackBar.open("Cannot enable sms notifications. Please register phone.", "Close", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      snack._dismissAfter(3000);
    }
  }

  launchVerificationRequestDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "300";
    dialogConfig.width = "40%"
    dialogConfig.minWidth = "360px";
    dialogConfig.minHeight = "300px"
    dialogConfig.data = {
    }

    const dialogRef = this._matDialog.open(CreateVerificationFormComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        this.getUserInfo();
      });
  }

}

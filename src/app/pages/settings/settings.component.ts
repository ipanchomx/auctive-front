import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router } from '@angular/router';
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

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  passwordForm: FormGroup;
  editableName: boolean = false;
  nameError: boolean = false;
  name: string;
  phone: string;
  email: string;
  joined: string;
  image: string;
  usrId: string;
  showForm = true;
  editablePhone: boolean = false;
  phoneError: boolean = false;
  is_verified: boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private _snackBar: MatSnackBar, 
    private router: Router, 
    private socketsService: SocketsService,
    private _matDialog: MatDialog,
    private _user: UserService
    ) { }


  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      current: ['', Validators.required],
      new: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: this.comparePasswords.bind(this)
    })
    this.usrId = this.authService.getUserId();

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
    // alert('Change photo');
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
    this._user.getUserInfo(this.usrId).then(data => {
      this.name = data.user.name;
      this.email = data.user.email;
      this.joined = new Date(data.user.joined).toLocaleDateString();
      this.image = data.user.image_url || "/assets/images/default-profile-pic.jpg";
      this.phone = data.user.phone_number;
      this.is_verified = data.user.is_verified;
    })
  }

  toggleEditablePhone(): void {
    if (this.editablePhone) {
      if (!this.phone) {
        this.phoneError = true
        return
      } else {
        this.phoneError = false;
        this._user.changePhoneNumber(this.phone)
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
            this.phone = undefined;
          })
      }
    }
    this.editablePhone = !this.editablePhone;
  }


  activateSMSNotifications() {
    if(this.phone) {
      this._user.activateSMSNotifications()
      .then((res:any) => {
        this.is_verified = true;
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
      })

    }
  }
}

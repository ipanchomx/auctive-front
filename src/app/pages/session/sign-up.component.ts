import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SessionService } from 'src/app/global/services/session.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from 'src/app/global/services/auth.service';
import { Router } from '@angular/router';

import { SocketsService } from 'src/app/global/services/sockets.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private sessionService: SessionService, private _snackBar: MatSnackBar, private authService: AuthService, private router: Router, private _socket: SocketsService,     private renderer: Renderer2,     private el: ElementRef,

    ) { }

  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";


  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: this.compararPasswords.bind(this)
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // this.googleAuth.authState.subscribe((user) => {
    //   if (!user) {
    //     return;
    //   }
    //   this.sessionService.googleLogin(user.idToken).then(data => {
    //     this.authService.saveUserId(data.userId);
    //     this.authService.save(data.token)
    //     this._socket.connect(this.authService.get(), this.authService.getUserId());
    //     this.router.navigate(["/file-manager"])
    //   }).catch(err => {
    //     const snack = this._snackBar.open(`Unable to login - ${err.error.message}`, "Close", {
    //       horizontalPosition: this.horizontalPosition,
    //       verticalPosition: this.verticalPosition,
    //     })
    //     snack._dismissAfter(3000);
    //     console.log(err);

    //   })
    // });
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body,'backgroundColor', '#3f598f');

  }

  crearUsuario() {
    if (this.signupForm.valid) {
      this.sessionService.signup(this.signupForm.getRawValue()).then(data => {
        const snack = this._snackBar.open("User successfully created", "Close", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        snack._dismissAfter(3000);
      }).catch(err => {
        console.error('Failed to signup user', err);
      });
    }
  }


  compararPasswords() {
    if (!this.signupForm) { return null; }
    const values = this.signupForm.getRawValue();
    if (values.password === values.confirm) {
      return null;
    } else {
      return { mismatch: true }
    }
  }


  iniciarSesion() {
    if (this.loginForm.valid) {
      this.sessionService.login(this.loginForm.getRawValue()).then(data => {
        this.authService.saveUserId(data.userId);
        this.authService.save(data.token)
        this._socket.connect(this.authService.get(), this.authService.getUserId());
        this.router.navigate(["/file-manager"])
      }).catch(err => {

        const snack = this._snackBar.open(`Unable to login - ${err.error.message}`, "Close", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        snack._dismissAfter(3000);
        console.log(err);
      })
    }
  }

  // signInWithGoogle(): void {
  //   this.googleAuth.signIn(GoogleLoginProvider.PROVIDER_ID)
  //   .catch(err => {
  //     const snack = this._snackBar.open(`Unable to login to Google`, "Close", {
  //       horizontalPosition: this.horizontalPosition,
  //       verticalPosition: this.verticalPosition,
  //     })
  //     snack._dismissAfter(3000);
  //   })
  // }

}

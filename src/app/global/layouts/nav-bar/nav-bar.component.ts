import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SocketsService } from '../../services/sockets.service';
import { UserService } from '../../services/user.service';

// import { NotificationsComponent } from 'src/app/dialogs/notifications/notifications.component';

export interface notification {
  message: string;
  date: Date;
  emiterEmail: string;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isLoggedIn: boolean = false;

  name: string = "";
  searchQuery: string = "";

  noSize = 0;

  constructor(private authService: AuthService,
    private router: Router,
    private _matDialog: MatDialog,
    private socketsService: SocketsService,
    private userService: UserService
  ) {

    this.authService.loginStatus.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.socketsService.socketStatus.subscribe(status => {
      if (status) {
        this.socketsService.on('notification', (data: Notification) => {
          this.noSize += 1;
        })
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.userService.getUserInfo(this.authService.getUserId())
        .then(res => {
          this.name = res.user.name;
        })
    }
  }

  logout() {
    this.socketsService.disconnect();
    this.authService.clear();
    this.router.navigate(['/home']);
  }

  searchProduct() {
    this.router.navigate(['/auctions'], { queryParamsHandling: "merge", queryParams: { q: this.searchQuery } })
  }

  // openNotifications() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.minWidth = "300px";
  //   dialogConfig.minHeight = "50px";
  //   dialogConfig.maxHeight = "75%";
  //   dialogConfig.width = "30%";
  //   dialogConfig.position = { top: '50px', right: '50px' };
  //   dialogConfig.data = { name: this.name };

  //   const dialogRef = this._matDialog.open(NotificationsComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.noSize = 0;
  //     //delete notifications
  //   });

  // }

}

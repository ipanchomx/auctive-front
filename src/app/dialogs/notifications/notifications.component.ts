import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/global/services/notifications.service';
import { UserService } from 'src/app/global/services/user.service';

export interface notification {
  "auctionTitle": string,
  "date": string,
  "notification_id": string,
  "emitter": string,
  "SK": string,
  "auctionId": string,
  "message": string,
  "PK": string
}


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: notification[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NotificationsComponent>,
    private notificationsService: NotificationsService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.notificationsService.getNotifications().subscribe((resp: any) => {
      console.log(resp);
      if(resp.success) this.notifications = resp.notifications.reverse();
    })

  }

  onClose(): void {
    this.dialogRef.close();
  }

  deleteAllNotifications() {
    this.notificationsService.deleteAllNotifications()
      .subscribe((res)=>{
        console.log(res);
        this.notifications = [];
      }, (err) => {
        console.log("Error deleting notifications");
      })
  }

  deleteThisNotification(notification) {
    this.notificationsService.deleteNotification(notification.notification_id).subscribe((res) => {
      // this.router.navigate(['/file-info', notification.fileId])
      this.onClose();
    }, (err) => {
      console.log("Error deleting notification");
    })
  }

}

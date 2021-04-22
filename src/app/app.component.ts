import { Component } from '@angular/core';
import { AuthService } from './global/services/auth.service';
import { SocketsService } from './global/services/sockets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'auctive-front';

  constructor(private authService: AuthService, private _socket: SocketsService){
    if(this.authService.isLoggedIn()){
      this._socket.connect(this.authService.get(), this.authService.getUserId());
    }
  }
}




import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  socketClient;
  constructor() { }

  socketStatus:BehaviorSubject<boolean> = new BehaviorSubject(false);

  connect(token:string, email:string) {
    this.socketClient = socketIo.io(environment.socketUrl, {
      transportOptions: {
        polling: {
          extraHeaders: {
            'Authorization': token,
            'user-email': email
          }
        }
      }
    });

    this.socketStatus.next(true);
  }

  on(eventName:string, callback:Function) {
    this.socketClient.on(eventName, callback);
  }

  emit(eventName:string, data:Object) {
    this.socketClient.emit(eventName, data);
  }

  disconnect() {
    if(this.socketClient && this.socketClient.connected) {
      this.socketClient.disconnect();
      this.socketStatus.next(false);
    }
  }
}

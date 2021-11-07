import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  socket:any;
  user:any;
  notifications:any[]=[];
  
  constructor(private usersService:UsersService,
    private tokenService:TokenService) { 
      this.socket = io('http://localhost:3000', { transports : ['websocket'] });
    }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.GetUser();
    this.socket.on('refreshPage',()=>{
      this.GetUser();
    });
  }

  GetUser(){
    this.usersService.GetUserById(this.user._id).subscribe(data=>{
      this.notifications = data.result.notifications;
    });
  }

  TimeFromNow(time: string) {
    return moment(time).fromNow();
  }

  MarkNotication(notification:any){
    if(notification.read){
      return;
    }
    this.usersService.MarkNotication(notification._id).subscribe(value=>{
      this.socket.emit('refresh', {});
    });
  }

  DeleteNotication(notification:any){
    this.usersService.MarkNotication(notification._id,true).subscribe(value=>{
      this.socket.emit('refresh', {});
    });
  }

}
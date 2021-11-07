import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  followers:any=[];
  socket:any;
  user:any;

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
      this.followers = data.result.followers;
    });
  }

  UnFollowUser(user:any){
    this.usersService.UnFollowUser(user._id).subscribe(data =>{
      this.socket.emit('refresh',{}); 
    });
  }


}

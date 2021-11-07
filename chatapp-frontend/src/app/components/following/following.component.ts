import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  following:any=[];
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
      this.following = data.result.following;
    });
  }

  UnFollowUser(user:any){
    this.usersService.UnFollowUser(user._id).subscribe(data =>{
      this.socket.emit('refresh',{}); 
    });
  }

}

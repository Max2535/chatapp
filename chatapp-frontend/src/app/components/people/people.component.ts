import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  socket:any;
  users:any=[];
  loggedInUser:any;
  userArr:any=[];
  onlineuser:any =[];

  constructor(private usersService:UsersService,
    private tokenService:TokenService,
    private router:Router) { 
      this.socket = io('http://localhost:3000', { transports : ['websocket'] });
    }

  ngOnInit(): void {
    this.loggedInUser = this.tokenService.GetPayload();
    this.GetUsers();
    this.GetUser();

    this.socket.on('refreshPage',()=>{
      this.GetUsers();
      this.GetUser();
    });
  }

  GetUsers(){
    this.usersService.GetAllUsers().subscribe(data=>{
      _.remove(data.result,{username:this.loggedInUser.username});
      this.users = data.result;
    });
  }

  GetUser(){
    this.usersService.GetUserById(this.loggedInUser._id).subscribe(data=>{
      this.userArr = data.result.following;
    });
  }

  FollowUser(user:any){
    this.usersService.FollowUser(user._id).subscribe(data => {
      this.socket.emit('refresh',{});    
    });
  }

  CheckInArray(arr:any,id:string){
    const result = _.find(arr,['userFollowed._id',id]);
    if(result){
      return true;
    }else{
      return false;
    }
  }

  online(event:any){
    this.onlineuser = event;
  }

  CheckIfOnline(name:string){
    const result = _.indexOf(this.onlineuser,name);
    if(result > -1){
      return true;
    }else{
      return false;
    }
  }

  ViewUser(user:any){
    this.router.navigate([user.username]);
    if(this.loggedInUser.username !== user.username){
      this.usersService.ProfileNotifications(user._id).subscribe(data=>{
        this.socket.emit('refresh',{});
      },err=>console.log(err));
    }
  }

}

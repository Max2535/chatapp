import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import * as _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit,AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  notifications:any=[];
  socket:any;
  count:any = [];
  chatList:any=[];
  msgNumber=0;
  imageId:any;
  imageVersion:any;

  constructor(private tokenService:TokenService,
    private router:Router,
    private userService:UsersService,
    private msgService:MessageService) { 
      this.socket = io('http://localhost:3000', { transports : ['websocket'] });
    }
  ngAfterViewInit(): void {
    this.socket.on('usersOnline',(data:any)=>{
       this.onlineUsers.emit(data);
    });
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();

    const dropDownElement:any = document.querySelectorAll('.dropdown-trigger')??"";
    M.Dropdown.init(dropDownElement,{
      alignment:'right',
      hover:true,
      coverTrigger:false
    });

    const dropDownElementTwo:any = document.querySelectorAll('.dropdown-trigger1')??"";
    M.Dropdown.init(dropDownElementTwo,{
      alignment:'left',
      hover:true,
      coverTrigger:false
    });

    this.socket.emit('online',{room:'global',user:this.user.username});

    this.GetUser();
    this.socket.on('refreshPage',()=>{
      this.GetUser();
    });
  }

  TimeFromNow(time: string) {
    return moment(time).fromNow();
  }

  GetUser(){
    this.userService.GetUserById(this.user._id).subscribe(data=>{
      this.imageId = data.result.picId;
      this.imageVersion = data.result.picVersion;
      this.notifications = data.result.notifications.reverse();
      this.count = _.filter(this.notifications,['read',false]);
      this.chatList = data.result.chatList;
      this.CheckIfread(this.chatList);
    },err =>{
      if(err.error.token === null){
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  CheckIfread(arr:any){
    const checkArr = [];
    for(let i = 0 ;i< arr.length;i++){
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if(this.router.url !== `/chat/${receiver.sendername}`){
        if(receiver.isRead === false && receiver.receivername === this.user.username){
          checkArr.push(1);
          this.msgNumber= _.sum(checkArr);
        }
      }
    }
  }

  logout(){
    this.tokenService.DeleteToken();
    this.router.navigate(['/']);
  }

  GotoHome(){
    this.router.navigate(['streams']);
  }

  GoToChatPage(username:string){
    this.router.navigate(['chat',username]);
    this.msgService.MarkMessage(this.user.username,username).subscribe(data=>{
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }

  MarkAll(){
    this.userService.MarkAllAsRead().subscribe(data=>{
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }
  MarkAllMessages(){
    this.msgService.MarkAllMessages().subscribe(data=>{
      console.log(data);
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }
  MessageDate(data:any){
    return moment(data).calendar(null,{
      sameDay:'[Today]',
      lastDay:'[Yesterday]',
      lastWeek:'DD/MM/YYYY',
      sameElse:'DD/MM/YYYY'
    });
  }

}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit ,AfterViewInit{
  commentForm!:FormGroup;
  toolbarElement:any;
  onlineusers:any;
  postId:any;
  commentsArrar:any=[];
  socket:any;
  post!:string;
  constructor() { }
  ngAfterViewInit(): void {
    this.toolbarElement.style.display = 'none';
  }

  ngOnInit(): void {
    this.toolbarElement = document.querySelector('.nav-content');
  }

  online(event:any){
    this.onlineusers=event;
  }

}

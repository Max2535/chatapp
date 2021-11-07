import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent } from 'ng2-emoji-picker';
import * as _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit,AfterViewInit,OnChanges {
  @Input() users:any;
  receiver!: string;
  receiverData: any;
  user: any;
  isOnline=false;
  message!: string;
  messagesArray:any;
  socket:any;
  typingMessage:any;
  userArray:any;
  typing:boolean=false;
  public direction =
  Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : Math.random() > 0.5 ? 'right' : 'left';
  public eventMock:any;
  public eventPosMock:any;
  public toggled = false;
  public content = ' ';
  private _lastCaretEvent!: CaretEvent;

  constructor(
    private tokenService: TokenService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {
    this.socket = io('http://localhost:3000', { transports : ['websocket'] });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const title = document.querySelector('.nameCol');
    if(changes.users.currentValue){
      const result = _.indexOf(changes.users.currentValue,this.receiver);
      if(result > -1){
        this.isOnline=true;
        (title as HTMLElement).style.marginTop = '10px';
      }else{
        this.isOnline=false;
        (title as HTMLElement).style.marginTop = '20px';
      }
    }
    this.userArray=this.user;
  }
  ngAfterViewInit(): void {
    const params = {
      room1:this.user.username,
      room2:this.receiver
    };

    this.socket.emit('join chat',params);
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.route.params.subscribe((params) => {
      this.receiver = params.name;
      this.GetUserByUsername(this.receiver);

      this.socket.on('refreshPage',()=>{
        this.GetUserByUsername(this.receiver);
      });
    });


    this.socket.on('is_typing',(data:any)=>{
        if(data.sender === this.receiver){
          this.typing = true;
        }
    });


    this.socket.on('has_stopped_typing',(data:any)=>{
        if(data.sender === this.receiver){
          this.typing = false;
        }
    });
  }

  GetUserByUsername(name: string) {
    this.userService.GetUserByName(name).subscribe((data) => {
      this.receiverData = data.result;

      this.GetAllMessage(this.user._id,data.result._id);
    });
  }

  GetAllMessage(senderId:string,receiverId:string) {
    this.msgService.GetAllMessage(senderId,receiverId).subscribe(data=>{
        this.messagesArray = data.messages.message;
    });
  }

  SendMessage() {
    if (this.message) {
      this.msgService
        .SendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message)
        .subscribe((data) => {
          this.socket.emit('refresh', {});
          this.message = '';
        });
    }
  }

  HandleSelection(event: any) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.content;

    this.toggled = !this.toggled;
    this.content = '';
  }

  Input(event: any){
    this.content = event.target.textContent
  }
  HandleCurrentCaret(event: any) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${
      event.textContent
    } }`;
  }

  Toggled() {
    this.toggled = !this.toggled;
  }

  IsTyping(){
    this.socket.emit('start_typing',{
      sender:this.user.username,
      receiver:this.receiver
    });

    if(this.typingMessage){
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(()=>{
      this.socket.emit('stop_typing',{
        sender:this.user.username,
        receiver:this.receiver
      });  
    },500);
  }
}

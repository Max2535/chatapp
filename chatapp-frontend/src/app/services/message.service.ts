import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient) { }

  SendMessage(senderId:string,receiverId:string,receiverName:string,message:string):Observable<any>{
    return this.http.post(`${BASEURL}/chat-message/${senderId}/${receiverId}`,{
      receiverId,
      receiverName,
      message
    });
  }

  GetAllMessage(senderId:string,receiverId:string):Observable<any>{
    return this.http.get(`${BASEURL}/chat-message/${senderId}/${receiverId}`);
  }
  MarkMessage(sender:string,receiver:string):Observable<any>{
    return this.http.get(`${BASEURL}/receiver-messages/${sender}/${receiver}`);
  }
  MarkAllMessages():Observable<any>{
    return this.http.get(`${BASEURL}/mark-all-messages`);
  }
}

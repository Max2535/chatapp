import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit,AfterViewInit{

  commentForm!:FormGroup;
  toolbarElement:any;
  postId:any;
  commentsArrar:any=[];
  socket:any;
  post!:string;

  constructor(private fb:FormBuilder,
    private postService:PostService,
    private route:ActivatedRoute) { 
      this.socket = io('http://localhost:3000', { transports: ['websocket'] });
    }

  ngAfterViewInit(): void {
    this.toolbarElement.style.display = 'none';
  }

  ngOnInit(): void {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');
    
    this.init();

    this.GetPost();
    this.socket.on('refreshPage',(data:any)=>{
      console.log(data);
      this.GetPost();
    });
  }

  init(){
    this.commentForm = this.fb.group({
      comment:['',Validators.required]
    });
  }

  AddComment(){
    this.postService.addComment(this.postId,this.commentForm.value).subscribe(data =>{
      this.commentForm.reset();
      //this.GetPost();
      this.socket.emit('refresh',{});
    });
  }

  GetPost(){
    this.postService.getPost(this.postId).subscribe(data=>{
      this.post = data.post.post;
      this.commentsArrar = data.post.comments.reverse();
    });
  }

  TimeFromNow(time: string) {
    return moment(time).fromNow();
  }

}

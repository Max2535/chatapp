import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import * as _ from 'lodash';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  socket: any;
  posts: any = [];
  user: any;

  constructor(private postService: PostService,
     private tokenService: TokenService,
     private router:Router) {
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.AllPosts();

    this.socket.on('refreshPage', () => {
      this.AllPosts();
    });
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data.posts;
    },err =>{
      if(err.error.token === null){
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  LikePost(post: any) {
    this.postService.addLike(post).subscribe(
      (data) => {
        this.socket.emit('refresh', {});
      },
      (err) => console.log(err)
    );
  }

  CheckInLikesArray(arr: any, username: any) {
    return _.some(arr, { username: username });
  }

  TimeFromNow(time: string) {
    return moment(time).fromNow();
  }

  OpenCommnetBox(post:any){
    this.router.navigate(['post',post._id]);
  }
}

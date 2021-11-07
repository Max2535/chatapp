import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  top:any=[];
  socket:any;
  user:any;

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
      this.top = data.top;
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

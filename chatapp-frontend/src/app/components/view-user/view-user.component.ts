import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit,AfterViewInit {
  tabElement:any;
  postsTab = false;
  followingTab = false;
  followersTab = false;
  posts:any = [];
  following:any = [];
  followers:any = [];
  user: any;
  name: any;
  postValue: any;
  editForm!: FormGroup;
  modalElement: any;
  socket: any;
  
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private postService: PostService,
    private fb: FormBuilder
  ) {
    this.socket = io('http://localhost:3000', { transports : ['websocket'] });
  }


  ngOnInit() {
    this.postsTab = true;
    const tabs:any = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.tabElement = document.querySelector('.nav-content');

    this.modalElement = document.querySelector('.modal');
    M.Modal.init(this.modalElement, {});

    this.route.params.subscribe(params => {
      this.name = params.name;
      this.GetUserData(this.name);
    });

    this.socket.on('refreshPage', (data:any) => {
      this.route.params.subscribe(params => {
        this.name = params.name;
        this.GetUserData(this.name);
      });
    });

    this.InitEditForm();
  }

  ngAfterViewInit() {
    this.tabElement.style.display = 'none';
  }

  InitEditForm() {
    this.editForm = this.fb.group({
      editedPost: ['', Validators.required]
    });
  }

  GetUserData(name:any) {
    this.usersService.GetUserByName(name).subscribe(
      data => {
        this.user = data.result;
        this.posts = data.result.posts.reverse();
        this.followers = data.result.followers;
        this.following = data.result.following;
      },
      err => console.log(err)
    );
  }

  OpenEditModal(post:any) {
    this.postValue = post;
  }

  SubmitEditedPost() {
    const body = {
      id: this.postValue.postId._id,
      post: this.editForm.value.editedPost
    };
    this.postService.EditPost(body).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
    M.Modal.getInstance(this.modalElement).close();
    this.editForm.reset();
  }

  CloseModal() {
    M.Modal.getInstance(this.modalElement).close();
    this.editForm.reset();
  }

  DeletePost() {
    this.postService.DeletePost(this.postValue.postId._id).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
    M.Modal.getInstance(this.modalElement).close();
  }

  ChangeTab(value:any) {
    if (value === 'posts') {
      this.postsTab = true;
      this.followersTab = false;
      this.followingTab = false;
    }

    if (value === 'following') {
      this.postsTab = false;
      this.followersTab = false;
      this.followingTab = true;
    }

    if (value === 'followers') {
      this.postsTab = false;
      this.followersTab = true;
      this.followingTab = false;
    }
  }

  TimeFromNow(time:any) {
    return moment(time).fromNow();
  }

}

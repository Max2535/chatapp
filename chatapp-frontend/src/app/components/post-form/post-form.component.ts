import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  uploader:FileUploader = new FileUploader({
    url:URL,
    disableMultipart:true
  });
  socket:any;
  postForm!:FormGroup;
  selectedFile:any;

  constructor(private fb:FormBuilder,private postService:PostService) { 
    this.socket = io('http://localhost:3000', { transports : ['websocket'] });
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.postForm = this.fb.group({
      post:['',Validators.required]
    });
  }

  SubmitPost(){
    let body:any;
    if(!this.selectedFile){
      body = {
        post:this.postForm.value.post
      };
    }else{
      body = {
        post:this.postForm.value.post,
        image:this.selectedFile
      };
    }
    this.postService.addPost(body).subscribe(data=>{
        this.socket.emit('refresh',{});
        this.postForm.reset();
    });
  }

  OnFileSelected(event:any){
    const file:File=event[0];

    this.ReadAsBase64(file).then(result=>{
      this.selectedFile = result;
    }).catch(err=>console.log(err));
  }


  ReadAsBase64(file:any):Promise<any>{
    const reader = new FileReader();
    const fileValue = new Promise((resolve,reject)=>{
      reader.addEventListener('load',()=>{
        resolve(reader.result);
      });

      reader.addEventListener('error',(event)=>{
        reject(event);
      });

      reader.readAsDataURL(file);
    });

    return fileValue;
  }



}

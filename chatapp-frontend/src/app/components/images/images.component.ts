import { FileUploader } from 'ng2-file-upload';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';

const URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  socket:any;
  uploader:FileUploader = new FileUploader({
    url:URL,
    disableMultipart:true
  });
  user:any;
  images:any=[];

  selectedFile:any;

  constructor(private usersService:UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000', { transports : ['websocket'] });
   }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.GetUser();

    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(
      data => {
        this.images = data.result.images;
      },
      err => console.log(err)
    );
  }

  OnFileSelected(event:any){
    const file:File=event[0];

    this.ReadAsBase64(file).then(result=>{
      this.selectedFile = result;
    }).catch(err=>console.log(err));
  }

  Upload(){
    if (this.selectedFile) {
      this.usersService.AddImage(this.selectedFile).subscribe(
        data => {
          this.socket.emit('refresh', {});
          const filePath = <HTMLInputElement>document.getElementById('filePath');
          filePath.value = '';
        },
        err => console.log(err)
      );
    }
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



  SetProfileImage(image:any){
    this.usersService.SetDefaultImage(image.imgId, image.imgVersion).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
 
  constructor(private http:HttpClient) { }

  GetAllUsers():Observable<any>{
    return this.http.get(`${BASEURL}/users`);
  }

  GetUserById(id:string):Observable<any>{
    return this.http.get(`${BASEURL}/user/${id}`);
  }

  GetUserByName(username:string):Observable<any>{
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  FollowUser(userFollowed:string):Observable<any>{
    return this.http.post(`${BASEURL}/follow-user`,{
      userFollowed
    });
  }

  UnFollowUser(userFollowed:string):Observable<any>{
    return this.http.post(`${BASEURL}/unfollow-user`,{
      userFollowed
    });
  }

  MarkNotication(id:string,deleteVal?:any):Observable<any>{
    return this.http.post(`${BASEURL}/mark/${id}`,{
      id,
      deleteVal
    });
  }

  MarkAllAsRead():Observable<any>{
    return this.http.post(`${BASEURL}/mark-all`,{
      all:true
    });
  }

  AddImage(image:any):Observable<any>{
    return this.http.post(`${BASEURL}/upload-image`,{
      image
    });
  }

  SetDefaultImage(imageId:any, imageVersion:any): Observable<any> {
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVersion}`);
  }

  ProfileNotifications(id:string): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`,{id});
  }

  ChangePassword(body:any): Observable<any> {
    return this.http.post(`${BASEURL}/user/change-password`,body);
  }

}

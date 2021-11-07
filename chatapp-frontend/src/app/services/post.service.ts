import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  addPost(body:any):Observable<any>{
    return this.http.post(`${BASEURL}/post/add-post`,body);
  }

  getAllPosts():Observable<any>{
    return this.http.get(`${BASEURL}/posts`);
  }

  addLike(body:any):Observable<any>{
    return this.http.post(`${BASEURL}/post/add-like`,body);
  }

  addComment(postId:string,comment:any):Observable<any>{
    return this.http.post(`${BASEURL}/post/add-comment`,{
      postId,
      comment
    });
  }

  getPost(id:number):Observable<any>{
    return this.http.get(`${BASEURL}/post/${id}`);
  }

  EditPost(body:any):Observable<any>{
    return this.http.get(`${BASEURL}/`);
  }

  DeletePost(id:number):Observable<any>{
    return this.http.get(`${BASEURL}/post/${id}`);
  }

}

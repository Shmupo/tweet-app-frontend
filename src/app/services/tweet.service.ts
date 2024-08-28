import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9191/api/posts`)
  }

  getPostById(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9191/api/posts/${postId}`)
  }

  getPostReplies(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9191/api/replies/${postId}`)
  }

  createPost(post: any): Observable<any> {
    return this.http.post(`http://localhost:9191/api/posts`, post)
  }

  updatePost(postId: number, post: any): Observable<any> {
    return this.http.put(`http://localhost:9191/api/posts/${postId}`, post)
  }

  createReply(postId: number, reply: any): Observable<any> {
    return this.http.post(`http://localhost:9191/api/replies/${postId}`, reply)
  }

  updateReply(postId: number, replyId: number, reply: any): Observable<any> {
    return this.http.get<any[]>(`http://localhost:9191/api/replies/${postId}/reply/${replyId}`)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetLikesService {

  constructor(private http: HttpClient) { }

  getPostLikeCount(postId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:9191/api/likes/post/${postId}/count`)
      .pipe(
        catchError(error => {
          console.log(`Error fetching like count for post ${postId}`, error);
          return of(0);
        })
      );
  }

  getUserLikedPostIds(userId: number): Observable<any> {
    return this.http.get<any[]>(`http://localhost:9191/api/likes/user/${userId}`)

  }

  createUserLikePost(userId: number, postId: number): Observable<any> {
    return this.http.post<any[]>(`http://localhost:9191/api/likes/user+post/${userId}/${postId}`, null)
  }

  deleteUserLikePost(userId: number, postId: number): Observable<any> {
    return this.http.delete<any[]>(`http://localhost:9191/api/likes/user+post/${userId}/${postId}`)
  }

  doesUserLikePost(userId: number, postId: number): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:9191/api/likes/user+post/${userId}/${postId}/exists`)
      .pipe(
        catchError(error => {
          console.log(`Error fetching like count for post ${postId}`, error);
          return of(false);
        })
      );
  }
}

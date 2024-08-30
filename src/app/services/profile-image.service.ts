import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {

  constructor(private http: HttpClient) { }

  getUserImageById(userId: number): Observable<Blob> {
    return this.http.get(`http://localhost:9191/api/users/id/${userId}/image`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error fetching image:', error);
        return throwError(() => error);
      })
    );
  }

  getImageByFilename(filename: string): Observable<Blob> {
    return this.http.get(`http://localhost:9191/api/users/images/${filename}`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error fetching image:', error);
        return throwError(() => error);
      })
    );
  }

  updateUserImage(fileName: string | null): Observable<any> {
    if (fileName === null || fileName.trim() === '') {
      console.log('Cannot set image to null or empty');
      return of(null);
    }

    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`http://localhost:9191/api/users/profile/image/${fileName}`, {}, { headers }).pipe(
        catchError(error => {
          console.error('Error setting profile image:', error);
          return throwError(() => error);
        })
      );
    } else {
      console.log('No token found');
      return of(null);
    }
  }
}

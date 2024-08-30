import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    return this.http.post('http://localhost:9191/api/users/auth/register', data, { responseType: 'text' })
  }

  login(data: any): Observable<any> {
    return this.http.post('http://localhost:9191/api/users/auth/login', data, { responseType: 'text' })
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      return this.http.get('http://localhost:9191/api/users/profile', { headers }).pipe(
        catchError(error => {
          localStorage.removeItem('token');
          console.error('Error fetching profile:', error);
          return throwError(() => error);
        })
      );
    } else {
      console.log('No token found');
      return of(null);
    }
  }

  checkToken(): boolean {
    if(localStorage.getItem('token')) {
      return true
    } else return false
  }

  logout() {
    localStorage.removeItem('token')
  }
}

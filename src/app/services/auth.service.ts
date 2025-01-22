import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Replace with your actual API URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Rediriger vers la page de login
    this.router.navigate(['/login']);
  }

  private handleError(error: any): Observable<never> {
    // Handle the error appropriately
    console.error('An error occurred:', error);
    throw error;
  }
}

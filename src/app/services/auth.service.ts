import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private isAuthenticatedFlag = false;
  private jwtToken: string | null = null;

  constructor(private snackBar: MatSnackBar, private http: HttpClient, private router: Router ,) { }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  login(username: string, password: string): Observable<any> {
    // Don't need auth header for login
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }, { headers })
        .pipe(
            tap(response => {
                if (response && response.jwt) {
                    this.jwtToken = response.jwt || '';  // Set a default value if the token is null
                    localStorage.setItem('username', username); // Save username
                    localStorage.setItem('jwtToken', this.jwtToken ?? '');  // Store token in localStorage
                    this.isAuthenticatedFlag = true;  // Set authentication flag to true
                    console.log('Token stored:', this.jwtToken); // Log pour vérifier le token

                }
            })
        );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.
    http.post(`${this.apiUrl}/register`, { username, password, email });
  }

  getAuthenticatedUser(): Observable<any> {
    // Need auth header for authenticated endpoints
    const headers = this.createAuthorizationHeader();
    return this.http.get<any>(`${this.apiUrl}/me`, { headers });
  }

  saveToken(token: string): void {
    this.jwtToken = token;
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    const username = localStorage.getItem('username'); // Assuming username is stored
    localStorage.removeItem('jwtToken');  // Remove JWT from localStorage
    this.jwtToken = null;                 // Clear the token in memory
    this.isAuthenticatedFlag = false;     // Reset authentication flag

     this.snackBar.open(`Goodbye, ${username}! You have logged out.`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
    this.router.navigate(['/login']);     // Redirect to the login page
  }

  getUserName(): string {
    if (!this.jwtToken) {
      this.jwtToken = localStorage.getItem('jwtToken') || '';
    }

    if (this.jwtToken) {
      const decodedToken = this.decodeToken(this.jwtToken);
      return decodedToken ? decodedToken.sub : '';  // assuming 'sub' holds the username
    }

    return 'Visitor'; // Return 'Visitor' if no token found
  }

  decodeToken(token: string): any {
    // Basic decode function for JWT (could be replaced by 'jwt-decode' library)
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    // Check if a valid token exists in localStorage (or your preferred storage)
    const token = localStorage.getItem('jwtToken');
    return !!token; // Return true if token exists, otherwise false
  }

  forgotPassword(email: string): Observable<any> {
    // Don't need auth header for forgot password
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email }, { headers });
  }

   // Reset the password
   resetPassword(token: string, newPassword: string): Observable<any> {
    // Don't need auth header for reset password
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { token, newPassword }, { headers });
  }
}

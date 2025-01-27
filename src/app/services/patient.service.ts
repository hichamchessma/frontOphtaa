import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Patient } from '../models/patient.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patients'; // À adapter selon votre backend
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  patients$ = this.patientsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    this.loadPatients();
  }

  // Méthode pour créer les headers avec le token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken'); // Récupère le token depuis le localStorage
    console.log('Token retrieved:', token); // Log pour vérifier le token
    if (token) {
      console.error('No token found in localStorage'); // Ajoute cette ligne
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajoute le token dans le header Authorization
    });
  }

  private loadPatients() {
    this.http.get<Patient[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            // Rediriger vers la page de connexion
            this.router.navigate(['/login']);
            this.snackBar.open('Session expirée. Veuillez vous reconnecter.', 'Fermer', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('Erreur lors de la récupération des patients. Veuillez réessayer.', 'Fermer', {
              duration: 3000,
            });
          }
          return throwError(error);
        })
      )
      .subscribe((patients) => {
        this.patientsSubject.next(patients);
      });
  }

  getPatients(): Observable<Patient[]> {
    return this.patients$;
  }

  getPatientById(id: number): Observable<Patient> {
    const headers = this.getHeaders();
    return this.http.get<Patient>(`${this.apiUrl}/${id}`, { headers });
  }

  addPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    const headers = this.getHeaders();
    return this.http.post<Patient>(this.apiUrl, patient, { headers });
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    const headers = this.getHeaders();
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient, { headers });
  }

  deletePatient(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  searchPatients(query: string): Observable<Patient[]> {
    const headers = this.getHeaders();
    return this.http.get<Patient[]>(`${this.apiUrl}/search?q=${query}`, { headers });
  }
}
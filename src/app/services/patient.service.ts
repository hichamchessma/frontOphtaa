import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log('Token retrieved:', token);
    if (!token) {
      console.error('No token found in localStorage');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public loadPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(patients => {
          console.log('Raw patients data:', patients); // Debug log
          const formattedPatients = patients.map(patient => {
            const rawDate = patient.dateNaissance;
            
            let formattedDate: Date | null = null;
            if (rawDate) {
              // Si la date est une chaîne ISO
              if (typeof rawDate === 'string') {
                formattedDate = new Date(rawDate);
              }
              // Si la date est déjà un objet Date
              else if (rawDate instanceof Date) {
                formattedDate = rawDate;
              }
            } else {
              console.warn('Date de naissance non définie pour le patient:', patient);
            }
            
            
            return {
              ...patient,
              dateNaissance: formattedDate
            };
          });
          
          this.patientsSubject.next(formattedPatients);
          return formattedPatients;
        }),
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
      );
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
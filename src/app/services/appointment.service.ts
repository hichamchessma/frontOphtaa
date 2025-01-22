import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Appointment } from '../models/appointment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) { }

  // Gestionnaire d'erreur global
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}, message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Récupérer tous les rendez-vous
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les rendez-vous du jour
  getTodayAppointments(): Observable<Appointment[]> {
    const today = new Date();
    const params = new HttpParams()
      .set('date', today.toISOString().split('T')[0]);
    return this.http.get<Appointment[]>(`${this.apiUrl}/today`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les rendez-vous par date
  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    const params = new HttpParams()
      .set('date', date.toISOString().split('T')[0]);
    return this.http.get<Appointment[]>(`${this.apiUrl}/by-date`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer un rendez-vous par ID
  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Créer un nouveau rendez-vous
  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour un rendez-vous
  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un rendez-vous
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Rechercher des rendez-vous
  searchAppointments(query: string): Observable<Appointment[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Appointment[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Confirmer un rendez-vous
  confirmAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/confirm`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Annuler un rendez-vous
  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/cancel`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les rendez-vous d'un patient
  getPatientAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`).pipe(
      catchError(this.handleError)
    );
  }
}

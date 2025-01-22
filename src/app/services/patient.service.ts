import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patients'; // À adapter selon votre backend
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  patients$ = this.patientsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPatients();
  }

  private loadPatients() {
    this.http.get<Patient[]>(this.apiUrl).subscribe(
      patients => this.patientsSubject.next(patients)
    );
  }

  getPatients(): Observable<Patient[]> {
    return this.patients$;
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  addPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchPatients(query: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/search?q=${query}`);
  }
}

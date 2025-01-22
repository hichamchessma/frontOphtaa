import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalFolder } from '../models/medical-folder.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalFolderService {
  private apiUrl = `${environment.apiUrl}/medical-folders`;

  constructor(private http: HttpClient) {}

  getMedicalFolderByPatientId(patientId: number): Observable<MedicalFolder> {
    return this.http.get<MedicalFolder>(`${this.apiUrl}/patient/${patientId}`);
  }

  updateVisualAcuity(folderId: number, visualAcuity: { rightEye: string; leftEye: string }): Observable<MedicalFolder> {
    return this.http.patch<MedicalFolder>(`${this.apiUrl}/${folderId}/visual-acuity`, visualAcuity);
  }

  updateEyePressure(folderId: number, eyePressure: { rightEye: number; leftEye: number }): Observable<MedicalFolder> {
    return this.http.patch<MedicalFolder>(`${this.apiUrl}/${folderId}/eye-pressure`, eyePressure);
  }

  addDiagnosis(folderId: number, diagnosis: { date: Date; description: string; treatment: string }): Observable<MedicalFolder> {
    return this.http.post<MedicalFolder>(`${this.apiUrl}/${folderId}/diagnoses`, diagnosis);
  }

  addPrescription(folderId: number, prescription: { date: Date; medication: string; dosage: string; duration: string }): Observable<MedicalFolder> {
    return this.http.post<MedicalFolder>(`${this.apiUrl}/${folderId}/prescriptions`, prescription);
  }
}

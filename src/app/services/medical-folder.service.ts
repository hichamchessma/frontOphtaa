import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MedicalFolder } from '../models/medical-folder.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalFolderService {
  private apiUrl = `${environment.apiUrl}/medical-folders`;

  constructor(private http: HttpClient) {}

  getAllMedicalFolders(): Observable<MedicalFolder[]> {
    // Données mockées pour 10 dossiers médicaux
    const mockFolders: MedicalFolder[] = [
      {
        id: 1,
        patientId: 1,
        patientName: 'Jean Dupont',
        dateOfBirth: new Date('1980-05-15'),
        gender: 'M',
        bloodType: 'A+',
        allergies: ['Pénicilline'],
        chronicDiseases: ['Diabète'],
        diagnoses: [{ date: new Date(), description: 'Myopie', treatment: 'Lunettes prescrites' }],
        visualAcuity: { rightEye: '20/20', leftEye: '20/20' },
        eyePressure: { rightEye: 14, leftEye: 15 }
      },
      {
        id: 2,
        patientId: 2,
        patientName: 'Marie Martin',
        dateOfBirth: new Date('1992-08-23'),
        gender: 'F',
        bloodType: 'O-',
        allergies: [],
        chronicDiseases: [],
        diagnoses: [{ date: new Date(), description: 'Astigmatisme', treatment: 'Lentilles prescrites' }],
        visualAcuity: { rightEye: '20/25', leftEye: '20/25' },
        eyePressure: { rightEye: 16, leftEye: 16 }
      },
      {
        id: 3,
        patientId: 3,
        patientName: 'Pierre Durand',
        dateOfBirth: new Date('1975-12-10'),
        gender: 'M',
        bloodType: 'B+',
        allergies: ['Latex'],
        chronicDiseases: ['Hypertension'],
        diagnoses: [{ date: new Date(), description: 'Glaucome débutant', treatment: 'Collyre prescrit' }],
        visualAcuity: { rightEye: '20/30', leftEye: '20/30' },
        eyePressure: { rightEye: 18, leftEye: 19 }
      },
      {
        id: 4,
        patientId: 4,
        patientName: 'Sophie Bernard',
        dateOfBirth: new Date('1988-03-28'),
        gender: 'F',
        bloodType: 'AB+',
        allergies: [],
        chronicDiseases: [],
        diagnoses: [{ date: new Date(), description: 'Conjonctivite', treatment: 'Gouttes prescrites' }],
        visualAcuity: { rightEye: '20/20', leftEye: '20/20' },
        eyePressure: { rightEye: 15, leftEye: 14 }
      },
      {
        id: 5,
        patientId: 5,
        patientName: 'Lucas Petit',
        dateOfBirth: new Date('1995-07-17'),
        gender: 'M',
        bloodType: 'A-',
        allergies: ['Pollen'],
        chronicDiseases: [],
        diagnoses: [{ date: new Date(), description: 'Hypermétropie', treatment: 'Lunettes prescrites' }],
        visualAcuity: { rightEye: '20/40', leftEye: '20/40' },
        eyePressure: { rightEye: 17, leftEye: 17 }
      }
    ];

    return of(mockFolders);
  }

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

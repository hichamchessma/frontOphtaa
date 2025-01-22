export interface MedicalFolder {
  id: number;
  patientId: number;
  patientName: string;
  dateOfBirth: Date;
  gender: 'M' | 'F';
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  visualAcuity?: {
    rightEye: string;
    leftEye: string;
  };
  eyePressure?: {
    rightEye: number;
    leftEye: number;
  };
  diagnoses?: {
    date: Date;
    description: string;
    treatment: string;
  }[];
  prescriptions?: {
    date: Date;
    medication: string;
    dosage: string;
    duration: string;
  }[];
  familyHistory?: string;
}

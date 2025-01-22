export interface Appointment {
    id: number;
    patientId: number;
    patientName: string;
    date: Date;
    time: string;
    reason: string;
    status: 'Confirmé' | 'En attente' | 'Annulé';
    notes?: string;
    doctorId: number;
}

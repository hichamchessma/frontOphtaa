import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  patientForm: FormGroup;
  searchTerm: string = '';
  isAddingPatient: boolean = false;
  selectedPatient: Patient | null = null;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.patientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      numeroSecuriteSociale: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(
      patients => {
        this.patients = patients;
        this.filteredPatients = patients;
      }
    );
  }

  searchPatients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = this.patients;
    } else {
      const search = this.searchTerm.toLowerCase();
      this.filteredPatients = this.patients.filter(patient =>
        patient.nom.toLowerCase().includes(search) ||
        patient.prenom.toLowerCase().includes(search) ||
        patient.numeroSecuriteSociale.includes(search)
      );
    }
  }

  toggleAddPatient(): void {
    this.isAddingPatient = !this.isAddingPatient;
    if (!this.isAddingPatient) {
      this.patientForm.reset();
    }
  }

  submitPatient(): void {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      if (this.selectedPatient) {
        // Mise à jour
        this.patientService.updatePatient(this.selectedPatient.id, {
          ...this.selectedPatient,
          ...patientData
        }).subscribe(() => {
          this.loadPatients();
          this.resetForm();
        });
      } else {
        // Ajout
        this.patientService.addPatient(patientData).subscribe(() => {
          this.loadPatients();
          this.resetForm();
        });
      }
    }
  }

  editPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.patientForm.patchValue(patient);
    this.isAddingPatient = true;
  }

  deletePatient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      this.patientService.deletePatient(id).subscribe(() => {
        this.loadPatients();
      });
    }
  }

  resetForm(): void {
    this.patientForm.reset();
    this.selectedPatient = null;
    this.isAddingPatient = false;
  }
}

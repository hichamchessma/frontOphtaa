import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  viewMode: 'card' | 'list' = 'card';
  showConfirmationModal: boolean = false;
  patientIdToDelete: number | null = null;
  confirmationMessage: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.loadPatients();
    }
  }

  loadPatients(): void {
    console.log('Loading patients...');
    this.patientService.loadPatients().subscribe(
      patients => {
        this.patients = patients;
        this.filteredPatients = this.patients;
        this.totalItems = this.filteredPatients.length;
      },
      error => {
        console.error('Error loading patients:', error);
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
    this.totalItems = this.filteredPatients.length;
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
    // Convert date if necessary
    const formattedDate = patient.dateNaissance ? new Date(patient.dateNaissance).toISOString().substring(0, 10) : '';
    this.patientForm.patchValue({
        ...patient,
        dateNaissance: formattedDate
    });
    this.isAddingPatient = true;
  }

  deletePatient(id: number): void {
    const patientToDelete = this.patients.find(patient => patient.id === id);
    if (patientToDelete) {
        this.showConfirmationModal = true;
        this.patientIdToDelete = id;
        this.confirmationMessage = `Êtes-vous sûr de vouloir supprimer ${patientToDelete.prenom} ${patientToDelete.nom} ?`;
    }
  }

  onConfirmDelete(): void {
    console.log('Confirm delete for ID:', this.patientIdToDelete);
    if (this.patientIdToDelete !== null) {
      console.log('Deleting patient with ID:', this.patientIdToDelete);
      this.patientService.deletePatient(this.patientIdToDelete).subscribe(
        () => {
          console.log('Patient deleted successfully');
          this.loadPatients();
          this.showConfirmationModal = false;
          this.patientIdToDelete = null;
        },
        error => {
          console.error('Error deleting patient:', error);
        }
      );
    }
  }

  onCancelDelete(): void {
    console.log('Delete cancelled');
    this.showConfirmationModal = false;
    this.patientIdToDelete = null;
  }

  resetForm(): void {
    this.patientForm.reset();
    this.selectedPatient = null;
    this.isAddingPatient = false;
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Non spécifiée';
    try {
      // Vérifier si la date est valide
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        console.error('Date invalide:', date);
        return 'Non spécifiée';
      }
      return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Non spécifiée';
    }
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'card' ? 'list' : 'card';
  }

  get paginatedPatients(): Patient[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPatients.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ceil(value: number): number {
    return Math.ceil(value);
  }

  affecterRendezVous(patient: Patient) {
    // Logique pour affecter un nouveau rendez-vous à ce patient
    console.log('Affecter un nouveau rendez-vous pour:', patient);
    // Ici, vous pouvez ajouter la logique pour ouvrir un formulaire ou rediriger vers une page de rendez-vous
    // Exemple de redirection vers une page de rendez-vous
    this.router.navigate(['/rendez-vous', patient.id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MedicalFolder } from '../../models/medical-folder.model';
import { MedicalFolderService } from '../../services/medical-folder.service';

@Component({
  selector: 'app-medical-folder',
  templateUrl: './medical-folder.component.html',
  styleUrls: ['./medical-folder.component.scss']
})
export class MedicalFolderComponent implements OnInit {
  medicalFolder: MedicalFolder | null = null;
  loading = true;
  error = '';
  selectedTab = 0;
  
  // Formulaires
  visualAcuityForm!: FormGroup;
  eyePressureForm!: FormGroup;
  diagnosisForm!: FormGroup;
  prescriptionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private medicalFolderService: MedicalFolderService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    // Récupérer l'ID du patient depuis l'URL
    this.route.params.subscribe(params => {
      const patientId = +params['id']; // Le + convertit la chaîne en nombre
      if (patientId) {
        this.loadMedicalFolder(patientId);
      }
    });
  }

  private initializeForms() {
    // Initialisation du formulaire d'acuité visuelle
    this.visualAcuityForm = this.fb.group({
      rightEye: ['', Validators.required],
      leftEye: ['', Validators.required]
    });

    // Initialisation du formulaire de pression oculaire
    this.eyePressureForm = this.fb.group({
      rightEye: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      leftEye: ['', [Validators.required, Validators.min(0), Validators.max(50)]]
    });

    // Initialisation du formulaire de diagnostic
    this.diagnosisForm = this.fb.group({
      description: ['', Validators.required],
      treatment: ['', Validators.required]
    });

    // Initialisation du formulaire de prescription
    this.prescriptionForm = this.fb.group({
      medication: ['', Validators.required],
      dosage: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  private loadMedicalFolder(patientId: number) {
    this.loading = true;
    this.medicalFolderService.getMedicalFolderByPatientId(patientId)
      .subscribe({
        next: (folder) => {
          this.medicalFolder = folder;
          this.loading = false;
          this.updateForms();
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement du dossier médical';
          this.loading = false;
          console.error('Erreur:', error);
        }
      });
  }

  private updateForms() {
    if (this.medicalFolder) {
      if (this.medicalFolder.visualAcuity) {
        this.visualAcuityForm.patchValue(this.medicalFolder.visualAcuity);
      }
      if (this.medicalFolder.eyePressure) {
        this.eyePressureForm.patchValue(this.medicalFolder.eyePressure);
      }
    }
  }

  // Mettre à jour l'acuité visuelle
  updateVisualAcuity() {
    if (this.visualAcuityForm.valid && this.medicalFolder) {
      this.medicalFolderService.updateVisualAcuity(
        this.medicalFolder.id,
        this.visualAcuityForm.value
      ).subscribe({
        next: (updatedFolder) => {
          this.medicalFolder = updatedFolder;
          this.showSuccessMessage('Acuité visuelle mise à jour');
        },
        error: (error) => {
          this.showErrorMessage('Erreur lors de la mise à jour de l\'acuité visuelle');
          console.error('Erreur:', error);
        }
      });
    }
  }

  // Mettre à jour la pression oculaire
  updateEyePressure() {
    if (this.eyePressureForm.valid && this.medicalFolder) {
      this.medicalFolderService.updateEyePressure(
        this.medicalFolder.id,
        this.eyePressureForm.value
      ).subscribe({
        next: (updatedFolder) => {
          this.medicalFolder = updatedFolder;
          this.showSuccessMessage('Pression oculaire mise à jour');
        },
        error: (error) => {
          this.showErrorMessage('Erreur lors de la mise à jour de la pression oculaire');
          console.error('Erreur:', error);
        }
      });
    }
  }

  // Ajouter un diagnostic
  addDiagnosis() {
    if (this.diagnosisForm.valid && this.medicalFolder) {
      const diagnosis = {
        date: new Date(),
        ...this.diagnosisForm.value
      };
      
      this.medicalFolderService.addDiagnosis(
        this.medicalFolder.id,
        diagnosis
      ).subscribe({
        next: (updatedFolder) => {
          this.medicalFolder = updatedFolder;
          this.diagnosisForm.reset();
          this.showSuccessMessage('Diagnostic ajouté');
        },
        error: (error) => {
          this.showErrorMessage('Erreur lors de l\'ajout du diagnostic');
          console.error('Erreur:', error);
        }
      });
    }
  }

  // Ajouter une prescription
  addPrescription() {
    if (this.prescriptionForm.valid && this.medicalFolder) {
      const prescription = {
        date: new Date(),
        ...this.prescriptionForm.value
      };
      
      this.medicalFolderService.addPrescription(
        this.medicalFolder.id,
        prescription
      ).subscribe({
        next: (updatedFolder) => {
          this.medicalFolder = updatedFolder;
          this.prescriptionForm.reset();
          this.showSuccessMessage('Prescription ajoutée');
        },
        error: (error) => {
          this.showErrorMessage('Erreur lors de l\'ajout de la prescription');
          console.error('Erreur:', error);
        }
      });
    }
  }

  // Afficher un message de succès
  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  // Afficher un message d'erreur
  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  // Méthode utilitaire pour joindre les tableaux avec une virgule
  getJoinedArray(arr: string[] | undefined): string {
    return arr?.join(', ') || '';
  }
}

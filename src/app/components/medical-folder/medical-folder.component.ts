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
  medicalFolders: MedicalFolder[] = [];
  selectedFolder: MedicalFolder | null = null;
  loading = true;
  error = '';
  selectedTab = 0;

  constructor(
    private medicalFolderService: MedicalFolderService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMedicalFolders();
  }

  loadMedicalFolders() {
    this.loading = true;
    this.medicalFolderService.getAllMedicalFolders().subscribe({
      next: (folders) => {
        this.medicalFolders = folders;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des dossiers médicaux';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  selectFolder(folder: MedicalFolder) {
    this.selectedFolder = folder;
  }

  getJoinedArray(arr: string[] | undefined): string {
    return arr?.join(', ') || '';
  }
}

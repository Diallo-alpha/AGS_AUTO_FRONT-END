import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../../services/video-service.service';
import { FormationService } from '../../../services/formation.service';
import { Formation } from '../../../models/FormationModel';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.css']
})
export class AjouterComponent implements OnInit {
  formations: Formation[] = [];
  videoTitle: string = '';
  selectedFormation: number | null = null;
  selectedFile: File | null = null;
  maxFileSize: number = 100 * 1024 * 1024; // 100 MB
  minFileSize: number = 5 * 1024 * 1024; // 5 MB
  uploadProgress: number = 0;
  uploadMessage: string = '';

  // Nouveaux champs pour la gestion des erreurs
  errors = {
    videoTitle: '',
    selectedFormation: '',
    selectedFile: '',
  };
  formSubmitted = false;

  constructor(private videoService: VideoService, private formationService: FormationService) {}

  ngOnInit() {
    this.loadFormations();
  }

  validateForm(): boolean {
    this.formSubmitted = true;
    let isValid = true;
    this.resetErrors();

    // Validation du titre
    if (!this.videoTitle || this.videoTitle.trim() === '') {
      this.errors.videoTitle = 'Le titre de la vidéo est requis';
      isValid = false;
    } else if (this.videoTitle.length < 3) {
      this.errors.videoTitle = 'Le titre doit contenir au moins 3 caractères';
      isValid = false;
    }

    // Validation de la formation
    if (!this.selectedFormation) {
      this.errors.selectedFormation = 'Veuillez sélectionner une formation';
      isValid = false;
    }

    // Validation du fichier
    if (!this.selectedFile) {
      this.errors.selectedFile = 'Veuillez sélectionner une vidéo';
      isValid = false;
    } else {
      if (this.selectedFile.size > this.maxFileSize) {
        this.errors.selectedFile = `La taille du fichier ne doit pas dépasser ${this.maxFileSize / (1024 * 1024)} MB`;
        isValid = false;
      } else if (this.selectedFile.size < this.minFileSize) {
        this.errors.selectedFile = `La taille du fichier doit être d'au moins ${this.minFileSize / (1024 * 1024)} MB`;
        isValid = false;
      }
    }

    return isValid;
  }

  resetErrors() {
    this.errors = {
      videoTitle: '',
      selectedFormation: '',
      selectedFile: '',
    };
    this.uploadMessage = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.errors.selectedFile = '';

      if (file.size > this.maxFileSize) {
        this.errors.selectedFile = `Le fichier est trop volumineux. La taille maximale autorisée est de ${this.maxFileSize / (1024 * 1024)} MB.`;
        event.target.value = '';
        this.selectedFile = null;
      } else if (file.size < this.minFileSize) {
        this.errors.selectedFile = `Le fichier est trop petit. La taille minimale requise est de ${this.minFileSize / (1024 * 1024)} MB.`;
        event.target.value = '';
        this.selectedFile = null;
      }
    }
  }

  async onSubmit() {
    if (!this.validateForm()) {
      this.uploadMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.videoTitle);
    formData.append('formation_id', this.selectedFormation!.toString());
    formData.append('video', this.selectedFile!, this.selectedFile!.name);

    this.videoService.createVideo(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        } else if (event instanceof HttpResponse) {
          this.uploadMessage = 'Vidéo uploadée avec succès';
          this.resetForm();
        }
      },
      error => {
        console.error('Error uploading video:', error);
        this.uploadMessage = 'Erreur lors du téléchargement de la vidéo. Veuillez réessayer.';
      }
    );
  }

  resetForm() {
    this.videoTitle = '';
    this.selectedFormation = null;
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.uploadMessage = '';
    this.formSubmitted = false;
    this.resetErrors();
  }

  loadFormations() {
    this.formationService.getAllFormations().subscribe(
      (data: Formation[]) => {
        this.formations = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des formations:', error);
        this.uploadMessage = 'Erreur lors du chargement des formations. Veuillez rafraîchir la page.';
      }
    );
  }
}

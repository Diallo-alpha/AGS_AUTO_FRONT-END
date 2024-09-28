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
  maxFileSize: number = 100 * 1024 * 1024; // 100 MB en octets
  minFileSize: number = 5 * 1024 * 1024; // 5 MB en octets
  uploadProgress: number = 0;
  uploadMessage: string = '';

  constructor(private videoService: VideoService, private formationService: FormationService) {}

  ngOnInit() {
    this.loadFormations();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > this.maxFileSize) {
        this.uploadMessage = `Le fichier est trop volumineux. La taille maximale autorisée est de ${this.maxFileSize / (1024 * 1024)} MB.`;
        event.target.value = ''; // Réinitialise l'input file
      } else {
        this.selectedFile = file;
        this.uploadMessage = '';
      }
    }
  }

  async onSubmit() {
    if (!this.videoTitle || !this.selectedFormation || !this.selectedFile) {
      this.uploadMessage = 'Veuillez remplir tous les champs';
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.videoTitle);
    formData.append('formation_id', this.selectedFormation.toString());
    formData.append('video', this.selectedFile, this.selectedFile.name);

    this.videoService.createVideo(formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        } else if (event instanceof HttpResponse) {
          this.uploadMessage = 'Vidéo uploadée avec succès';
          console.log('Video uploaded successfully', event.body);
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

  getFormationName(formationId: number): string {
    const formation = this.formations.find(f => f.id === formationId);
    return formation ? formation.nom_formation : 'Formation non trouvée';
  }
}

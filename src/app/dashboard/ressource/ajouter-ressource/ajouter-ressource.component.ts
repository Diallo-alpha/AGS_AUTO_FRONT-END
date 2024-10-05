import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RessourceService } from '../../../services/ressource.service';
import { Ressource } from '../../../models/ressourceModel';
import { VideoService } from '../../../services/video-service.service';

@Component({
  selector: 'app-ajouter-ressource',
  standalone: true,
  imports: [SidbarComponent, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './ajouter-ressource.component.html',
  styleUrl: './ajouter-ressource.component.css'
})
export class AjouterRessourceComponent implements OnInit {
  ressourceForm: FormGroup;
  videos: any[] = [];
  selectedFile: File | null = null;
  errorMessages: string[] = [];
  successMessage: string = '';
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private ressourceService: RessourceService,
    private videoService: VideoService
  ) {
    this.ressourceForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      video_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getAllVideos().subscribe(
      (data) => {
        this.videos = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des vidéos:', error);
        this.errorMessages.push('Erreur lors du chargement des vidéos. Veuillez réessayer.');
      }
    );
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.errorMessages.push('Type de fichier non autorisé. Veuillez sélectionner un fichier PDF, DOCX, XLSX, TXT, JPG, JPEG ou PNG.');
        this.selectedFile = null;
      } else if (this.selectedFile.size > 22077000) { // 22077 Ko en octets
        this.errorMessages.push('Le fichier est trop volumineux. La taille maximale est de 22077 Ko.');
        this.selectedFile = null;
      } else {
        this.errorMessages = this.errorMessages.filter(msg => !msg.startsWith('Type de fichier') && !msg.startsWith('Le fichier est trop volumineux'));
      }
    }
  }

  onSubmit() {
    this.errorMessages = [];
    this.successMessage = '';
    this.isSubmitting = true;

    if (this.ressourceForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('titre', this.ressourceForm.get('titre')?.value);
      formData.append('documents', this.selectedFile);
      formData.append('video_id', this.ressourceForm.get('video_id')?.value);

      this.ressourceService.createRessource(formData).subscribe(
        (ressource) => {
          console.log('Ressource ajoutée avec succès:', ressource);
          this.successMessage = 'La ressource a été ajoutée avec succès.';
          this.ressourceForm.reset();
          this.selectedFile = null;
          this.isSubmitting = false;
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la ressource:', error);
          if (Array.isArray(error)) {
            this.errorMessages = error;
          } else {
            this.errorMessages.push(error);
          }
          this.isSubmitting = false;
        }
      );
    } else {
      if (!this.selectedFile) {
        this.errorMessages.push('Veuillez sélectionner un fichier.');
      }
      if (this.ressourceForm.invalid) {
        Object.keys(this.ressourceForm.controls).forEach(key => {
          const control = this.ressourceForm.get(key);
          if (control?.invalid) {
            if (control.errors?.['required']) {
              this.errorMessages.push(`Le champ ${key} est requis.`);
            }
            if (control.errors?.['minlength']) {
              this.errorMessages.push(`Le champ ${key} doit contenir au moins ${control.errors?.['minlength'].requiredLength} caractères.`);
            }
            if (control.errors?.['maxlength']) {
              this.errorMessages.push(`Le champ ${key} ne doit pas dépasser ${control.errors?.['maxlength'].requiredLength} caractères.`);
            }
          }
        });
      }
      this.isSubmitting = false;
    }
  }
}

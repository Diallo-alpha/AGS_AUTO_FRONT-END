import { Component, OnInit } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../../services/video-service.service';
import { FormationService } from '../../../services/formation.service';
import { Formation } from '../../../models/FormationModel';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-modifier',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './modifier.component.html',
  styleUrls: ['./modifier.component.css']
})
export class ModifierComponent implements OnInit {
  videoId: number;
  videoTitle: string = '';
  selectedFormation: number;
  selectedFile: File | null = null;
  formations: Formation[] = [];
  uploadProgress: number = 0;
  uploadMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService,
    private formationService: FormationService
  ) {
    this.videoId = 0;
    this.selectedFormation = 0;
  }

  ngOnInit() {
    this.loadFormations();
    this.route.params.subscribe(params => {
      this.videoId = +params['id'];
      this.loadVideoDetails();
    });
  }

  loadFormations() {
    this.formationService.getAllFormations().subscribe(
      (formations: Formation[]) => {
        this.formations = formations;
      },
      (error) => {
        console.error('Erreur lors du chargement des formations:', error);
      }
    );
  }

  loadVideoDetails() {
    this.videoService.getVideo(this.videoId).subscribe(
      (video) => {
        this.videoTitle = video.titre;
        this.selectedFormation = video.formation_id;
      },
      (error) => {
        console.error('Erreur lors du chargement des détails de la vidéo:', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit() {
    if (!this.videoTitle || !this.selectedFormation) {
      this.uploadMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.videoTitle);
    formData.append('formation_id', this.selectedFormation.toString());
    if (this.selectedFile) {
      formData.append('video', this.selectedFile, this.selectedFile.name);
    }

    this.videoService.updateVideo(this.videoId, formData).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
        } else if (event.type === HttpEventType.Response) {
          this.uploadMessage = 'Vidéo mise à jour avec succès!';
          setTimeout(() => {
            this.router.navigate(['/dashboard/video']);
          }, 2000);
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la vidéo:', error);
        this.uploadMessage = 'Erreur lors de la mise à jour de la vidéo. Veuillez réessayer.';
      }
    );
  }
}

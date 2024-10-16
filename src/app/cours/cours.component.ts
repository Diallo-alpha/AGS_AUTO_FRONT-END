import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/authservice.service';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video-service.service';
import { RessourceService } from '../services/ressource.service';
import { ProgressionService } from '../services/progression.service';
import { Formation } from '../models/FormationModel';
import { Ressource } from '../models/ressourceModel';
import { Video } from '../models/VideoModel';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface VideoResourceResponse {
  videos: Video[];
  resources: Ressource[];
}

interface ResourceResponse {
  message: string;
  video: string;
  resources: Ressource[];
}

interface ProgressionResponse {
  message: string;
  data: {
    pourcentage: number;
    completed: boolean;
    videos_regardees: number[];
  };
}

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [NavConnectComponent, FooterComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {
  formation: Formation | null = null;
  videos: Video[] = [];
  currentVideo: Video | null = null;
  currentResources: Ressource[] = [];
  safeVideoUrl: SafeResourceUrl | null = null;
  progression = 0;
  watchedVideos: number[] = [];
  showRatingModal = false;
  ratingForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private formationService: FormationService,
    private videoService: VideoService,
    private ressourceService: RessourceService,
    private sanitizer: DomSanitizer,
    private progressionService: ProgressionService,
    private fb: FormBuilder
  ) {
    this.ratingForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      review: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFormationWithVideos(+id);
    } else {
      console.error('Aucun ID de formation trouvé dans l\'URL');
    }
  }

  loadFormationWithVideos(id: number): void {
    this.formationService.getFormation(id).pipe(
      tap((formation: Formation) => {
        this.formation = formation;
        console.log('Formation chargée:', this.formation);
      }),
      switchMap((formation: Formation) => this.videoService.getVideoRessources(formation.id)),
      tap((response: VideoResourceResponse) => {
        this.videos = response.videos;
        console.log('Vidéos chargées:', this.videos);
        if (this.videos.length > 0) {
          this.selectVideo(this.videos[0]);
        }
      }),
      switchMap(() => this.progressionService.getProgression(id)),
      tap((response: ProgressionResponse) => {
        this.progression = response.data.pourcentage;
        this.watchedVideos = response.data.videos_regardees;
        console.log('Progression chargée:', this.progression);
        console.log('Vidéos regardées:', this.watchedVideos);
      }),
      catchError(error => {
        console.error('Erreur lors du chargement de la formation, des vidéos ou de la progression', error);
        return of(null);
      })
    ).subscribe({
      next: () => {},
      error: (err) => console.error('Une erreur est survenue:', err),
      complete: () => console.log('Chargement terminé')
    });
  }

  selectVideo(video: Video): void {
    this.currentVideo = video;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(video.video);
    this.loadResourcesForVideo(video.id);
    console.log('Vidéo sélectionnée:', video.titre);
  }

  loadResourcesForVideo(videoId: number): void {
    this.ressourceService.getResourcesByVideoId(videoId).subscribe({
      next: (response: ResourceResponse) => {
        this.currentResources = response.resources;
        console.log('Ressources chargées pour la vidéo:', this.currentResources);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ressources', error);
      }
    });
  }

  onVideoEnded(): void {
    if (this.currentVideo && this.formation) {
      if (!this.watchedVideos.includes(this.currentVideo.id)) {
        this.watchedVideos.push(this.currentVideo.id);
      }
      this.updateProgression();
    }
  }

  updateProgression(): void {
    if (this.formation && this.currentVideo) {
      this.progressionService.updateProgression(this.formation.id, this.currentVideo.id).subscribe({
        next: (response: ProgressionResponse) => {
          this.progression = response.data.pourcentage;
          this.watchedVideos = response.data.videos_regardees;
          console.log('Progression mise à jour:', this.progression);
          console.log('Vidéos regardées:', this.watchedVideos);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la progression', error);
        }
      });
    }
  }

  isVideoWatched(videoId: number): boolean {
    return this.watchedVideos.includes(videoId);
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }

  generateCertificate(): void {
    if (this.formation && this.progression === 100) {
      this.progressionService.generateCertificate(this.formation.id).subscribe({
        next: (data: Blob) => {
          const downloadURL = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = `certificat_${this.formation?.nom_formation}.pdf`;
          link.click();
        },
        error: (error) => {
          console.error('Erreur lors de la génération du certificat', error);
          // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
        }
      });
    }
  }

  openRatingModal(): void {
    if (this.progression === 100) {
      this.showRatingModal = true;
    }
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.ratingForm.reset();
  }

  setRating(value: number): void {
    this.ratingForm.patchValue({ rating: value });
  }

  submitRating(): void {
    if (this.ratingForm.valid && this.formation) {
      const { rating: note, review: avis } = this.ratingForm.value;
      this.formationService.rateFormation(this.formation.id, note, avis).subscribe({
        next: (response) => {
          console.log('Note ajoutée avec succès', response);
          this.closeRatingModal();
        },
        error: (error) => {
          console.error('Erreur pendant l\'ajout de la note', error);
          if (error.status === 422 && error.error && error.error.errors) {
            console.log('Erreurs de validation:', error.error.errors);
          }
        }
      });
    }
  }
}

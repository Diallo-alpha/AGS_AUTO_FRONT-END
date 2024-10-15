import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/authservice.service';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video-service.service';
import { RessourceService } from '../services/ressource.service';
import { ProgressionService } from '../services/progression.service';
import { Formation } from '../models/FormationModel';
import { Video } from '../models/VideoModel';
import { Ressource } from '../models/ressourceModel';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
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
  imports: [NavConnectComponent, FooterComponent, CommonModule],
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {
  formation: Formation | null = null;
  videos: Video[] = [];
  currentVideo: Video | null = null;
  currentResources: Ressource[] = [];
  safeVideoUrl: SafeResourceUrl | null = null;
  progression: number = 0;
  watchedVideos: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private formationService: FormationService,
    private videoService: VideoService,
    private ressourceService: RessourceService,
    private sanitizer: DomSanitizer,
    private progressionService: ProgressionService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFormationWithVideos(+id);
    } else {
      console.error('Aucun ID de formation trouvé dans l\'URL');
    }
  }

  loadFormationWithVideos(id: number) {
    this.formationService.getFormation(id).pipe(
      tap(formation => {
        this.formation = formation;
        console.log('Formation chargée:', this.formation);
      }),
      switchMap(formation => this.videoService.getVideoRessources(formation.id)),
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

  selectVideo(video: Video) {
    this.currentVideo = video;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(video.video);
    this.loadResourcesForVideo(video.id);
    console.log('Vidéo sélectionnée:', video.titre);
  }

  loadResourcesForVideo(videoId: number) {
    this.ressourceService.getResourcesByVideoId(videoId).subscribe(
      (response: ResourceResponse) => {
        this.currentResources = response.resources;
        console.log('Ressources chargées pour la vidéo:', this.currentResources);
      },
      error => {
        console.error('Erreur lors du chargement des ressources', error);
      }
    );
  }

  onVideoEnded() {
    if (this.currentVideo && this.formation) {
      if (!this.watchedVideos.includes(this.currentVideo.id)) {
        this.watchedVideos.push(this.currentVideo.id);
      }
      this.updateProgression();
    }
  }

  updateProgression() {
    if (this.formation && this.currentVideo) {
      this.progressionService.updateProgression(this.formation.id, this.currentVideo.id).subscribe(
        (response: ProgressionResponse) => {
          this.progression = response.data.pourcentage;
          this.watchedVideos = response.data.videos_regardees;
          console.log('Progression mise à jour:', this.progression);
          console.log('Vidéos regardées:', this.watchedVideos);
        },
        error => {
          console.error('Erreur lors de la mise à jour de la progression', error);
        }
      );
    }
  }

  isVideoWatched(videoId: number): boolean {
    return this.watchedVideos.includes(videoId);
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavConnectComponent } from '../nav-connect/nav-connect.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/authservice.service';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video-service.service';
import { RessourceService } from '../services/ressource.service';
import { Formation } from '../models/FormationModel';
import { Video } from '../models/VideoModel';
import { Ressource } from '../models/ressourceModel';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private formationService: FormationService,
    private videoService: VideoService,
    private ressourceService: RessourceService,
    private sanitizer: DomSanitizer
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
      tap(videos => {
        this.videos = videos;
        console.log('Vidéos chargées:', this.videos);
        if (this.videos.length > 0) {
          this.selectVideo(this.videos[0]);
        }
      }),
      catchError(error => {
        console.error('Erreur lors du chargement de la formation ou des vidéos', error);
        throw error;
      })
    ).subscribe();
  }

  selectVideo(video: Video) {
    this.currentVideo = video;
    const videoUrl = `${video}`; 
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    console.log('Vidéo sélectionnée:', video.titre);
    this.loadResourcesForVideo(video.id);
  }

  loadResourcesForVideo(videoId: number) {
    this.videoService.getVideoRessources(videoId).pipe(
      tap(resources => {
        this.currentResources = resources;
        console.log('Ressources chargées:', this.currentResources);
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des ressources', error);
        throw error;
      })
    ).subscribe();
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }
}

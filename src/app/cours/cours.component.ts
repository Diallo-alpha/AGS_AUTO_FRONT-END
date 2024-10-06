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

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [NavConnectComponent, FooterComponent, CommonModule],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent implements OnInit {
  formation: Formation | null = null;
  videos: Video[] = [];
  currentVideo: Video | null = null;
  resources: Ressource[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private formationService: FormationService,
    private videoService: VideoService,
    private ressourceService: RessourceService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFormation(+id);
      this.loadVideos(+id);
    }
  }

  loadFormation(id: number) {
    this.formationService.getFormation(id).subscribe(
      formation => {
        this.formation = formation;
      },
      error => console.error('Erreur lors du chargement de la formation', error)
    );
  }

  loadVideos(formationId: number) {
    this.videoService.getVideoRessources(formationId).subscribe(
      videos => {
        this.videos = videos;
        if (this.videos.length > 0) {
          this.selectVideo(this.videos[0]);
        }
      },
      error => console.error('Erreur lors du chargement des vidéos', error)
    );
  }

  selectVideo(video: Video) {
    this.currentVideo = video;
    this.loadResourcesForVideo(video.id);
  }

  loadResourcesForVideo(videoId: number) {
    this.ressourceService.getAllRessources().subscribe(
      (ressources: Ressource[]) => {
        this.resources = ressources.filter(r => r.video_id === videoId);
      },
      error => console.error('Erreur lors du chargement des ressources', error)
    );
  }

  isEtudiant(): boolean {
    return this.authService.isEtudiant();
  }

  getVideoUrl(video: Video): string {
    return video.video; // Assurez-vous que c'est le bon champ pour l'URL de la vidéo
  }
}

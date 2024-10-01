import { FooterComponent } from './../footer/footer.component';
import { NavbarComponent } from './../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { Formation } from '../models/FormationModel';
import { FormationService } from '../services/formation.service';
import { Video } from '../models/VideoModel';
import { VideoService } from '../services/video-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detailformation',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './detailformation.component.html',
  styleUrl: './detailformation.component.css'
})
export class DetailformationComponent implements OnInit {
  formation: Formation | null = null;
  videos: Video[] = [];

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    const formationId = Number(this.route.snapshot.paramMap.get('id'));
    if (formationId) {
      this.loadFormationDetails(formationId);
    }
  }

  loadFormationDetails(id: number): void {
    this.formationService.getFormation(id).subscribe(
      (data: Formation) => {
        // console.log('Formation data received:', data);
        this.formation = data;
        this.loadFormationVideos(id);
      },
      error => {
        console.error('Error fetching formation details', error);
      }
    );
  }

  loadFormationVideos(id: number): void {
    this.videoService.getVideoRessources(id).subscribe(
      (data: any) => {
        // console.log('Raw video data received:', data);
        if (Array.isArray(data)) {
          this.videos = data;
        } else if (typeof data === 'object' && data !== null) {
          // Si data est un objet, essayons de trouver un tableau à l'intérieur
          const videoArray = Object.values(data).find(value => Array.isArray(value));
          this.videos = Array.isArray(videoArray) ? videoArray : [];
        } else {
          this.videos = [];
        }
        // console.log('Processed videos:', this.videos);
      },
      error => {
        console.error('Error fetching videos', error);
        this.videos = [];
      }
    );
  }
}

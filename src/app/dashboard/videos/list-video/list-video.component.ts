import { Component, OnInit, ViewChild } from '@angular/core';
import { SidbarComponent } from '../../sidbar/sidbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video-service.service';
import { FormationService } from '../../../services/formation.service';
import { Video } from '../../../models/VideoModel';
import { Formation } from '../../../models/FormationModel';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface VideoWithFormation extends Video {
  formationDetails?: Formation;
}

@Component({
  selector: 'app-list-video',
  standalone: true,
  imports: [SidbarComponent, RouterModule, CommonModule],
  templateUrl: './list-video.component.html',
  styleUrls: ['./list-video.component.css']
})
export class ListVideoComponent implements OnInit {
  videos: VideoWithFormation[] = [];
  selectedVideo: VideoWithFormation | null = null;
  selectedVideoUrl: string | null = null;

  @ViewChild('videoModal') videoModal: any;

  constructor(
    private videoService: VideoService,
    private formationService: FormationService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getAllVideos().pipe(
      switchMap((videos: Video[]) => {
        const formationRequests = videos.map(video =>
          this.formationService.getFormation(video.formation_id)
        );
        return forkJoin(formationRequests).pipe(
          map(formations => {
            return videos.map((video, index) => ({
              ...video,
              formationDetails: formations[index]
            }));
          })
        );
      })
    ).subscribe(
      (videosWithFormations: VideoWithFormation[]) => {
        this.videos = videosWithFormations;
      },
      (error) => {
        console.error('Erreur lors du chargement des vidéos:', error);
      }
    );
  }

  deleteVideo(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      this.videoService.deleteVideo(id).subscribe(
        () => {
          console.log('Vidéo supprimée avec succès');
          this.loadVideos(); // Recharger la liste après la suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de la vidéo:', error);
        }
      );
    }
  }
  openVideoModal(video: VideoWithFormation) {
    this.selectedVideo = video;
    this.selectedVideoUrl = this.videoService.getVideoUrl(video.video);
    this.modalService.open(this.videoModal, { size: 'lg' });
  }
}

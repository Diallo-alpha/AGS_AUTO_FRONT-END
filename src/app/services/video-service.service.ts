import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/VideoModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiEndpoint = `${apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  getAllVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiEndpoint);
  }

  getVideo(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiEndpoint}/${id}`);
  }

  createVideo(videoData: FormData): Observable<any> {
    return this.http.post(`${apiUrl}/video/ajouter`, videoData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateVideo(id: number, videoData: FormData): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/${id}`, videoData);
  }

  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.apiEndpoint}/${id}`);
  }

  getVideoRessources(formationId: number): Observable<any> {
    return this.http.get(`${apiUrl}/formations/${formationId}/video-ressources`);
  }

  //lurl de la vidéo
  getVideoUrl(videoPath: string): string {
    return `${apiUrl}/storage/video/${videoPath}`;
  }
}

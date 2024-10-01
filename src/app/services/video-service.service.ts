import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/VideoModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiEndpoint = `${apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  getVideoRessources(formationId: number): Observable<any> {
    return this.http.get(`${apiUrl}/formations/${formationId}/videos`);
  }
  getAllVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiEndpoint);
  }

  getVideo(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiEndpoint}/${id}`);
  }

  createVideo(videoData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${apiUrl}/video/ajouter`, videoData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  updateVideo(id: number, videoData: FormData): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/${id}`, videoData);
  }

  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.apiEndpoint}/${id}`);
  }

}

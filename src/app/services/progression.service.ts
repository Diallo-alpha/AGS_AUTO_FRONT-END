import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';
import { ApiResponse } from '../list-cours-termine/list-cours-termine.component';
@Injectable({
  providedIn: 'root'
})
export class ProgressionService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  getProgression(formationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/progression/${formationId}`);
  }

  updateProgression(formationId: number, videoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/progression/update`, {
      formation_id: formationId,
      video_id: videoId
    });
  }

  generateCertificate(formationId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/formations/${formationId}/certificate`, {
      responseType: 'blob'
    });
  }

  getFormationsTerminees(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/formations-terminer`);
  }

  getFormationsEnCours(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/succes-formation`);
  }
}

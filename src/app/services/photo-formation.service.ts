import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoFormation } from '../models/PhotoFormation';
import { apiUrl } from './apiUrl';
const API_URL = apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PhotoFormationService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllPhotoFormations(): Observable<PhotoFormation[]> {
    return this.http.get<PhotoFormation[]>(`${API_URL}/photo_formations`, { headers: this.getHeaders() });
  }

  getPhotoFormation(id: number): Observable<PhotoFormation> {
    return this.http.get<PhotoFormation>(`${API_URL}/photo_formations/${id}`, { headers: this.getHeaders() });
  }

  createPhotoFormation(photoFormation: PhotoFormation, file: File): Observable<PhotoFormation> {
    const formData = new FormData();
    formData.append('nom_photo', photoFormation.nom_photo);
    formData.append('formation_id', photoFormation.formation_id.toString());
    formData.append('photo', file);

    return this.http.post<PhotoFormation>(`${API_URL}/photo_formations`, formData, { headers: this.getHeaders() });
  }

  updatePhotoFormation(id: number, photoFormation: PhotoFormation, file?: File): Observable<PhotoFormation> {
    const formData = new FormData();
    formData.append('nom_photo', photoFormation.nom_photo);
    formData.append('formation_id', photoFormation.formation_id.toString());
    if (file) {
      formData.append('photo', file);
    }

    return this.http.post<PhotoFormation>(`${API_URL}/photo_formations/${id}`, formData, { headers: this.getHeaders() });
  }

  deletePhotoFormation(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/photo_formations/${id}`, { headers: this.getHeaders() });
  }

  getPhotoUrl(photoPath: string): string {
    if (!photoPath) return 'https://placehold.co/400x300';
    return `${API_URL}/storage/${photoPath}`;
  }
}

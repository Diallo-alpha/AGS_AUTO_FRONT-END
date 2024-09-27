import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoFormation } from '../models/PhotoFormation';

const API_URL = 'https://certif.alphaloppecity.simplonfabriques.com/api';

@Injectable({
  providedIn: 'root'
})
export class PhotoFormationService {
  constructor(private http: HttpClient) {}

  getAllPhotoFormations(): Observable<PhotoFormation[]> {
    return this.http.get<PhotoFormation[]>(`${API_URL}/photo_formations`);
  }

  getPhotoFormation(id: number): Observable<PhotoFormation> {
    return this.http.get<PhotoFormation>(`${API_URL}/photo_formations/${id}`);
  }

  createPhotoFormation(photoFormation: PhotoFormation, file: File): Observable<PhotoFormation> {
    const formData = new FormData();
    formData.append('nom_photo', photoFormation.nom_photo);
    formData.append('formation_id', photoFormation.formation_id.toString());
    formData.append('photo', file);

    return this.http.post<PhotoFormation>(`${API_URL}/photo_formations`, formData);
  }

  updatePhotoFormation(id: number, photoFormation: PhotoFormation, file?: File): Observable<PhotoFormation> {
    const formData = new FormData();
    formData.append('nom_photo', photoFormation.nom_photo);
    formData.append('formation_id', photoFormation.formation_id.toString());
    if (file) {
      formData.append('photo', file);
    }

    return this.http.post<PhotoFormation>(`${API_URL}/photo_formations/${id}`, formData);
  }

  deletePhotoFormation(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/photo_formations/${id}`);
  }

  getPhotosByFormation(formationId: number): Observable<PhotoFormation[]> {
    return this.http.get<PhotoFormation[]>(`${API_URL}/formations/${formationId}/photos`);
  }
  //

  getPhotoUrl(id: number): string {
    return `${API_URL}/photo_formations/${id}/photo`;
  }
}

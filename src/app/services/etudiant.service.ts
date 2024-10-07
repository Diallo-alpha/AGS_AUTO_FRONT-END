import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  // Headers pour l'authentification (à adapter selon votre système d'auth)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });
  }

  // Afficher les formations achetées par l'utilisateur
  getFormationsAchetees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/formation/acheter`, { headers: this.getHeaders() });
  }

  // Obtenir les progressions pour une formation
  getProgressions(formationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/progressions/${formationId}`, { headers: this.getHeaders() });
  }

  // Créer une nouvelle progression
  createProgression(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/progressions`, data, { headers: this.getHeaders() });
  }

  // Mettre à jour une progression
  updateProgression(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/progressions/${id}`, data, { headers: this.getHeaders() });
  }

  // Ajouter une note à une formation
  addNote(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes`, data, { headers: this.getHeaders() });
  }

  // Mettre à jour une note
  updateNote(noteId: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/notes/${noteId}`, data, { headers: this.getHeaders() });
  }

  // Streamer une vidéo
  streamVideo(filename: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/video/${filename}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  // CRUD pour les ressources
  getRessources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ressources`, { headers: this.getHeaders() });
  }

  getRessource(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ressources/${id}`, { headers: this.getHeaders() });
  }

  deleteRessource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ressources/${id}`, { headers: this.getHeaders() });
  }
}

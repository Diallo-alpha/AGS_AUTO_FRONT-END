import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ressource } from '../models/ressourceModel';
import { apiUrl } from './apiUrl';
import { VideoService } from './video-service.service';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient, private videoService: VideoService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  getRessourcesForVideo(formationId: number): Observable<Ressource[]> {
    return this.videoService.getVideoRessources(formationId).pipe(
      map(response => response.resources)
    );
  }

  // Get all resources (admin only)
  getAllRessources(): Observable<Ressource[]> {
    return this.http.get<Ressource[]>(`${this.apiUrl}/ressources`, { headers: this.getHeaders() });
  }

  // Get a specific resource
  getRessource(id: number): Observable<Ressource> {
    return this.http.get<Ressource>(`${this.apiUrl}/ressources/${id}`, { headers: this.getHeaders() });
  }

  // Create a new resource (admin only)
  createRessource(ressourceData: FormData): Observable<Ressource> {
    return this.http.post<Ressource>( `${this.apiUrl}/ressources`, ressourceData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update a resource (admin only)
  updateRessource(id: number, ressourceData: FormData): Observable<Ressource> {
    return this.http.post<Ressource>(`${this.apiUrl}/ressources/${id}`, ressourceData, { headers: this.getHeaders() });
  }

  // Delete a resource (admin only)
  deleteRessource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ressources/${id}`, { headers: this.getHeaders() });
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Une erreur s\'est produite:', error.error.message);
      return throwError(() => 'Une erreur s\'est produite. Veuillez réessayer.');
    } else {
      // Erreur renvoyée par le serveur
      if (error.status === 422) {
        // Erreurs de validation
        console.error('Erreurs de validation:', error.error);
        const validationErrors = error.error.errors;
        const errorMessages = Object.values(validationErrors).flat();
        return throwError(() => errorMessages);
      } else {
        // Autres erreurs serveur
        console.error(
          `Code d'erreur ${error.status}, ` +
          `message: ${error.error}`);
        return throwError(() => 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
      }
    }
  }
}

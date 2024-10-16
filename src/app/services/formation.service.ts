import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/FormationModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private API_URL = apiUrl;

  constructor(private http: HttpClient) {}

  // Headers pour les requêtes nécessitant une authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.API_URL}/formations`);
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.API_URL}/formations/${id}`);
  }

  createFormation(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/formations`, formData, {
      headers: this.getAuthHeaders(),
      observe: 'response'
    });
  }

  updateFormation(id: number, formData: FormData): Observable<{ message: string; formation: Formation }> {
    return this.http.post<{ message: string; formation: Formation }>(
      `${this.API_URL}/formations/${id}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteFormation(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/formations/${id}`, { headers: this.getAuthHeaders() });
  }

  // Noter une formation
  rateFormation(formationId: number, note: number, avis: string): Observable<any> {
    return this.http.post(`${this.API_URL}/formations/${formationId}/note`, { formation_id: formationId, note, avis }, { headers: this.getAuthHeaders() });
  }

  updateRating(noteId: number, note: number, avis: string): Observable<any> {
    return this.http.put(`${this.API_URL}/note-formations/${noteId}`, { note, avis }, { headers: this.getAuthHeaders() });
  }
  //
  getFormationAvis(formationId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/avis/${formationId}`);
  }
}

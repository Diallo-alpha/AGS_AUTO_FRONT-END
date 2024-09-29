import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/FormationModel';

const API_URL = 'https://certif.alphaloppecity.simplonfabriques.com/api';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  constructor(private http: HttpClient) {}

  // Headers pour les requêtes nécessitant une authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${API_URL}/formations`);
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${API_URL}/formations/${id}`);
  }

  createFormation(formation: Formation): Observable<{ message: string; formation: Formation }> {
    return this.http.post<{ message: string; formation: Formation }>(`${API_URL}/formations`, formation, { headers: this.getAuthHeaders() });
  }

  updateFormation(id: number, formation: Formation): Observable<{ message: string; formation: Formation }> {
    return this.http.put<{ message: string; formation: Formation }>(`${API_URL}/formations/${id}`, formation, { headers: this.getAuthHeaders() });
  }

  deleteFormation(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/formations/${id}`, { headers: this.getAuthHeaders() });
  }
}
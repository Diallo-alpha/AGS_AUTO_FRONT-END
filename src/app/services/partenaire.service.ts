import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { partenaire } from '../models/partenaireModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class PartenaireService {
  private apiUrl = `${apiUrl}/partenaires`;

  constructor(private http: HttpClient) { }

  getPartenaires(): Observable<partenaire[]> {
    return this.http.get<partenaire[]>(this.apiUrl);
  }

  getPartenaire(id: number): Observable<partenaire> {
    return this.http.get<partenaire>(`${this.apiUrl}/${id}`);
  }

  createPartenaire(partenaire: partenaire, logo: File): Observable<any> {
    const formData = new FormData();
    Object.entries(partenaire).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (logo) {
      formData.append('logo', logo, logo.name);
    }
    return this.http.post(this.apiUrl, formData);
  }

  updatePartenaire(id: number, partenaire: partenaire, logo?: File): Observable<any> {
    const formData = new FormData();
    Object.entries(partenaire).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (logo) {
      formData.append('logo', logo, logo.name);
    }
    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  deletePartenaire(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

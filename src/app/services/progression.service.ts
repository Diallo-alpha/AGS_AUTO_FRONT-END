import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ProgressionService {
  private apiUrl = apiUrl

  constructor(private http: HttpClient) { }

  getProgression(formationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${formationId}`);
  }

  updateProgression(formationId: number, pourcentage: number): Observable<any> {
    return this.http.post(this.apiUrl, { formation_id: formationId, pourcentage });
  }
}

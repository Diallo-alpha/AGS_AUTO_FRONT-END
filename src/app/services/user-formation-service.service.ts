import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFormation } from '../models/userFormationModel';
import { apiUrl } from './apiUrl';
@Injectable({
  providedIn: 'root'
})
export class UserFormationService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  getUserFormations(): Observable<UserFormation[]> {
    return this.http.get<UserFormation[]>(this.apiUrl);
  }

  buyFormation(userId: number, formationId: number): Observable<UserFormation> {
    return this.http.post<UserFormation>(this.apiUrl, { user_id: userId, formation_id: formationId });
  }

  getFormationDetails(userFormationId: number): Observable<UserFormation> {
    return this.http.get<UserFormation>(`${this.apiUrl}/${userFormationId}`);
  }

  deleteFormation(userFormationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userFormationId}`);
  }
}

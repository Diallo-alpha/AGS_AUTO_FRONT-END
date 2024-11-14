import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';
@Injectable({
  providedIn: 'root'
})
export class CommandesService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  getAllCommandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/commandes`);
  }

  getCommande(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes/${id}`);
  }

  updateCommande(id: number, commande: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/commandes/${id}`, commande);
  }

  deleteCommande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commandes/${id}`);
  }
}

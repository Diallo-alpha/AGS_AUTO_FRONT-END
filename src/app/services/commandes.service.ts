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

    // Récupérer toutes les commandes
    getAllCommandes(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/commandes`);
    }
      // Récupérer une commande spécifique
  getCommande(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes/${id}`);
  }
  // Mettre à jour une commande
  updateCommande(id: number, commande: any): Observable<any> {
    const formData = new FormData();
    Object.keys(commande).forEach(key => {
      if (commande[key] instanceof File) {
        formData.append(key, commande[key]);
      } else {
        formData.append(key, JSON.stringify(commande[key]));
      }
    });
    return this.http.put(`${this.apiUrl}/commandes/${id}`, formData);
  }
    // Supprimer une commande
    deleteCommande(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/commandes/${id}`);
    }

}

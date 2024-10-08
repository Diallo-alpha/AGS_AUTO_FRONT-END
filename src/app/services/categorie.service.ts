import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorieModel';
import { apiUrl } from './apiUrl';



@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les catégories
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categories`);
  }

  // Récupérer une catégorie spécifique
  getCategorie(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/categories/${id}`);
  }

  // Créer une nouvelle catégorie
  createCategorie(categorie: FormData): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiUrl}/categories`, categorie);
  }

  // Mettre à jour une catégorie
  updateCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/categories/${id}`, categorie);
  }

  // Supprimer une catégorie
  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }
}

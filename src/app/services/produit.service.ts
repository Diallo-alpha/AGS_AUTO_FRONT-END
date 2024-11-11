import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produitModel';
import { apiUrl } from './apiUrl';

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProductsByCategory(categoryId: number, page: number = 1): Observable<PaginatedResponse<Produit>> {
    return this.http.get<PaginatedResponse<Produit>>(`${this.apiUrl}/produit/categorie/${categoryId}?page=${page}`);
  }

  getProduits(page: number = 1): Observable<PaginatedResponse<Produit>> {
    return this.http.get<PaginatedResponse<Produit>>(`${this.apiUrl}/produits?page=${page}`);
  }

  getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/produits/${id}`);
  }

  createProduit(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produits`, formData, {
      headers: this.getAuthHeaders(),
      observe: 'response'
    });
  }

  updateProduit(id: number, formData: FormData): Observable<{ message: string; produit: Produit }> {
    return this.http.post<{ message: string; produit: Produit }>(
      `${this.apiUrl}/produits/${id}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteProduit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete${id}`, { headers: this.getAuthHeaders() });
  }
//
// getProductsByCategory(categoryId: number, page: number = 1): Observable<PaginatedResponse<Produit>> {
//   return this.http.get<PaginatedResponse<Produit>>(`${this.apiUrl}/produits/categorie/${categoryId}?page=${page}`);
// }
}

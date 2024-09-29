import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/ArticleModel';
import { apiUrl } from './apiUrl';
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  // Obtenir tous les articles
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`);
  }

  // Obtenir un article spécifique
  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`);
  }

  // Créer un nouvel article
  createArticle(articleData: FormData): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles`, articleData);
  }

  // Mettre à jour un article
  updateArticle(id: number, articleData: FormData): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles/${id}`, articleData);
  }

  // Supprimer un article
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`);
  }
}

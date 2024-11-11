import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commentaire } from '../models/commentaireModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  getCommentaires(): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/commentaires`);
  }

  getCommentaire(id: number): Observable<Commentaire> {
    return this.http.get<Commentaire>(`${this.apiUrl}/commentaires/${id}`);
  }

  // getCommentaireArticle(id: number): Observable<Commentaire> {
  //   return this.http.get<Commentaire>(`${this.apiUrl}/commentaires/article/${id}`);
  // }
  createCommentaire(commentaire: Commentaire): Observable<Commentaire> {
    const formData = new FormData();
    formData.append('nom_complet', commentaire.nom_complet);
    formData.append('contenu', commentaire.contenu);
    formData.append('article_id', commentaire.article_id.toString());

    return this.http.post<Commentaire>(`${this.apiUrl}/commentaires`, formData);
  }

  deleteCommentaire(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commentaires/${id}`);
  }

  getCommentairesByArticle(articleId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/commentaires/artiicle/${articleId}`);
  }
}

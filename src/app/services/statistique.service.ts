import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  constructor(private http: HttpClient) {}

  getUserStats(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/statistique/utilisateurs`).pipe(
      catchError(this.handleError)
    );
  }

  getContentStats(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/statistics/content`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Une erreur est survenue:', error);
    return throwError(() => new Error(error.error?.message || 'Erreur serveur'));
  }
}

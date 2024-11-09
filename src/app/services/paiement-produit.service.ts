import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { apiUrl } from './apiUrl';
import { CartItem } from '../models/CartItemModel';
import { Produit } from '../models/produitModel';

export interface PaymentResponse {
  success: boolean;
  redirect_url?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PaiementProduitService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  initierPaiement(cartItems: CartItem[]): Observable<PaymentResponse> {
    const paymentData = {
      produits: cartItems.map(item => ({
        id: item.id,
        quantite: item.quantite
      }))
    };

    console.log('Envoi de la demande de paiement pour les produits:', paymentData);

    return this.http.post<PaymentResponse>(`${this.apiUrl}/initier-paiement`, paymentData).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  gererNotification(notificationData: any): Observable<any> {
    console.log('Envoi des données de notification au serveur:', notificationData);
    return this.http.post(`${this.apiUrl}/paiement-notification`, notificationData).pipe(
      tap(response => console.log('Réponse du serveur:', response)),
      catchError(this.handleError)
    );
  }

  gererSuccesPaiement(refPayment: string): Observable<any> {
    const params = new HttpParams().set('ref_payment', refPayment);
    return this.http.get(`${this.apiUrl}/paiement-succes`, { params }).pipe(
      tap((response: any) => {
        if (response.redirect_url) {
          window.location.href = response.redirect_url;
        }
      }),
      catchError(this.handleError)
    );
  }

  gererAnnulationPaiement(): Observable<any> {
    return this.http.get(`${this.apiUrl}/paiement-annulation`).pipe(
      catchError(this.handleError)
    );
  }

  private handleResponse(response: PaymentResponse): PaymentResponse {
    console.log('Réponse du serveur:', response);
    return response;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.';
      } else {
        errorMessage = `Code d'erreur ${error.status}, message: ${error.error.message || error.message}`;
      }
      console.error('Détails de l\'erreur:', error.error);
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

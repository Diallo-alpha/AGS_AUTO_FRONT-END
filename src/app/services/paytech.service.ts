import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiUrl } from './apiUrl';
import { CartItem } from '../models/CartItemModel';

export interface PaymentResponse {
  success: boolean;
  redirect_url?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  initiatePaymentForFormation(formationId: number, totalPrice: number): Observable<PaymentResponse> {
    const paymentData = {
      item_name: `Formation #${formationId}`,
      item_price: totalPrice,
      currency: 'XOF',
      formation_id: formationId
    };

    console.log('Sending payment request:', paymentData);

    return this.http.post<PaymentResponse>(`${this.apiUrl}/payment/initiate`, paymentData).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  initiatePaymentForCart(cartItems: CartItem[], totalPrice: number): Observable<PaymentResponse> {
    const firstItem = cartItems[0];
    const paymentData = {
      item_name: `Cart Purchase - ${firstItem.nom}`,
      item_price: totalPrice,
      currency: 'XOF',
      formation_id: firstItem.id
    };

    console.log('Sending payment request:', paymentData);

    return this.http.post<PaymentResponse>(`${this.apiUrl}/payment/initiate`, paymentData).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  // Nouvelles méthodes pour les routes supplémentaires

  handleIPN(): Observable<any> {
    return this.http.post(`${this.apiUrl}/paytech-ipn`, {}).pipe(
      catchError(this.handleError)
    );
  }

  paymentCancel(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paiements/cancel/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  handleNotification(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/paytech/notification`, data).pipe(
      catchError(this.handleError)
    );
  }

  paymentSuccess(): Observable<any> {
    return this.http.get(`${this.apiUrl}/paytech/success`).pipe(
      catchError(this.handleError)
    );
  }

  private handleResponse(response: PaymentResponse): PaymentResponse {
    console.log('Server response:', response);
    return response;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur ${error.status}, message: ${error.error.message || error.message}`;
      console.error('Error details:', error.error);
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

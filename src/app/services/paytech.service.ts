import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiUrl } from './apiUrl';
import { CartItem } from '../models/CartItemModel';

// export interface CartItem {
//   name: string;
//   price: number;
//   quantity: number;
// }

export interface PaymentResponse {
  success?: number;
  redirect_url?: string;
  redirectUrl?: string;
}

export type PaymentResult = PaymentResponse | { redirectUrl: string };

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  //paiementformation
  initiatePaymentForFormation(formationId: number, totalPrice: number): Observable<PaymentResult> {
    const paymentData = {
      item_name: `Formation #${formationId}`,
      item_price: totalPrice,
      currency: 'XOF',
      formationId: formationId
    };

    console.log('Sending payment request for formation:', paymentData);

    return this.http.post(`${this.apiUrl}/payment/initiate`, paymentData).pipe(
      map(response => {
        console.log('Server response:', response);
        if (typeof response === 'string') {
          try {
            return JSON.parse(response) as PaymentResponse;
          } catch {
            if (response.startsWith('https')) {
              return { redirectUrl: response };
            }
            throw new Error('Invalid response format');
          }
        }
        return response as PaymentResponse;
      }),
      catchError(this.handleError)
    );
  }

  initiatePaymentForCart(cartItems: CartItem[], totalPrice: number): Observable<PaymentResult> {
    const paymentData = {
      item_name: 'Achat du panier',
      item_price: totalPrice,
      currency: 'XOF'
    };

    console.log('Sending payment request:', paymentData);

    return this.http.post(`${this.apiUrl}/payment/initiate`, paymentData).pipe(
      map(response => {
        console.log('Server response:', response);
        if (typeof response === 'string') {
          try {
            return JSON.parse(response) as PaymentResponse;
          } catch {
            if (response.startsWith('https')) {
              return { redirectUrl: response };
            }
            throw new Error('Invalid response format');
          }
        }
        return response as PaymentResponse;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse | Error): Observable<PaymentResult> {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        errorMessage = `Code d'erreur ${error.status}, message: ${error.message}`;
        console.error('Error details:', error.error);

        if (error.status === 200 && typeof error.error === 'string' && error.error.startsWith('https')) {
          return new Observable(observer => {
            observer.next({ redirectUrl: error.error });
            observer.complete();
          });
        }
      }
    } else {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

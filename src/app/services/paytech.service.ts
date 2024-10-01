import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiUrl } from './apiUrl';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentResponse {
  success: number;
  redirect_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = apiUrl;

  constructor(private http: HttpClient) { }

  initiatePaymentForCart(cartItems: CartItem[], totalPrice: number): Observable<PaymentResponse> {
    const paymentData = {
      item_name: 'Achat du panier',
      item_price: totalPrice,
      currency: 'XOF'
    };

    console.log('Sending payment request:', paymentData);

    return this.http.post(`${this.apiUrl}/payment/initiate`, paymentData, { responseType: 'text' }).pipe(
      map(response => {
        console.log('Raw response:', response);
        try {
          const parsedResponse = JSON.parse(response) as PaymentResponse;
          console.log('Parsed response:', parsedResponse);
          return parsedResponse;
        } catch (error) {
          console.error('Error parsing response:', error);
          throw new Error('Invalid response format');
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse | Error) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        errorMessage = `Code d'erreur ${error.status}, message: ${error.message}`;
        console.error('Error details:', error.error);
      }
    } else {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

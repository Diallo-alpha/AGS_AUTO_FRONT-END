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

interface PaymentResponse {
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
    return this.http.post<PaymentResponse>(`${this.apiUrl}/payment/initiate`, paymentData).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  private parseResponse(response: PaymentResponse): PaymentResponse {
    console.log('Payment initiation response:', response);
    if (response.success !== 1 || !response.redirect_url) {
      throw new Error('Invalid payment response');
    }
    return response;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur ${error.status}, message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

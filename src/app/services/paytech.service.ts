import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  initiatePaymentForCart(cartItems: CartItem[], totalPrice: number): Observable<PaymentResponse> {
    const paymentData = {
      item_name: 'Achat du panier',
      item_price: totalPrice,
      currency: 'XOF'
    };
    return this.http.post<PaymentResponse>(`${this.apiUrl}/payment/initiate`, paymentData, {
      headers: this.getHeaders()
    }).pipe(
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { apiUrl } from './apiUrl';
import { CartItem } from '../models/CartItemModel';

export interface PaymentResponse {
  success: boolean;
  redirect_url?: string;
  errors?: string[];
  transaction_id: string;
}

export interface PaymentVerificationResponse {
  status: string;
  amount: number;
  date: string;
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

    console.log('Sending payment request for formation:', paymentData);

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

    console.log('Sending payment request for cart:', paymentData);

    return this.http.post<PaymentResponse>(`${this.apiUrl}/payment/initiate`, paymentData).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  handlePaytechNotification(notificationData: any): Observable<any> {
    console.log('Sending notification data to server:', notificationData);
    return this.http.post(`${this.apiUrl}/paytech/notification`, notificationData).pipe(
      tap(response => console.log('Server response:', response)),
      catchError(this.handleError)
    );

  }

  verifyPayment(refCommand: string): Observable<PaymentVerificationResponse> {
    const params = new HttpParams().set('ref_command', refCommand);
    return this.http.get<PaymentVerificationResponse>(`${this.apiUrl}/verify-payment`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  cancelPayment(refCommand: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/paiements/cancel/${refCommand}`).pipe(
      catchError(this.handleError)
    );
  }

  handlePaymentSuccess(formationId: number, refPayment: string): Observable<any> {
    const params = new HttpParams()
      .set('formation_id', formationId.toString())
      .set('ref_payment', refPayment);
    return this.http.get(`${this.apiUrl}/paytech/success`, { params }).pipe(
      tap((response: any) => {
        if (response.redirect_url) {
          window.location.href = response.redirect_url;
        }
      }),
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
      if (error.status === 0) {
        errorMessage = 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.';
      } else {
        errorMessage = `Code d'erreur ${error.status}, message: ${error.error.message || error.message}`;
      }
      console.error('Error details:', error.error);
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

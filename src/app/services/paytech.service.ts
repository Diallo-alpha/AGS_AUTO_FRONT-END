import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
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

  initiatePaymentForCart(cartItems: CartItem[], totalPrice: number): Observable<any> {
    const paymentData = {
      item_name: 'Cart Purchase',
      item_price: totalPrice,
      currency: 'XOF'
    };
    return this.http.post(`${this.apiUrl}/payment/initiate`, paymentData, { headers: this.getHeaders() });
  }
  getPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/status/${paymentId}`, { headers: this.getHeaders() });
  }
}

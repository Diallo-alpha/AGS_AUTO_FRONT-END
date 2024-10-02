import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { CartItem } from '../models/CartItemModel';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private apiUrl = apiUrl;

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart(): void {
    this.http.get<{ panier: { [key: string]: CartItem } }>(`${this.apiUrl}/panier`)
      .pipe(
        map(response => Object.values(response.panier)),
        catchError(this.handleError)
      )
      .subscribe(
        items => {
          console.log('Cart loaded from API:', items);
          this.cartItems.next(items);
        },
        error => {
          console.error('Error loading cart:', error);
          this.cartItems.next([]);
        }
      );
  }

  getCart(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(item: Omit<CartItem, 'quantite'>, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/panier/ajouter`, {
      item_id: item.id,
      item_type: item.type,
      quantity: quantity
    }).pipe(
      tap(() => this.loadCart()),
      catchError(this.handleError)
    );
  }

  removeFromCart(item: CartItem): Observable<any> {
    return this.http.delete(`${this.apiUrl}/panier/retirer`, {
      body: { item_id: item.id, item_type: item.type }
    }).pipe(
      tap(() => this.loadCart()),
      catchError(this.handleError)
    );
  }

  updateQuantity(item: CartItem, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/panier/mettre-a-jour`, {
      item_id: item.id,
      item_type: item.type,
      quantity: quantity
    }).pipe(
      tap(() => this.loadCart()),
      catchError(this.handleError)
    );
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => total + item.prix * item.quantite, 0);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError('Something went wrong. Please try again later.');
  }
}

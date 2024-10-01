import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, CartItem, PaymentResponse } from '../services/paytech.service';
// import { PaymentService, CartItem, PaymentResponse } from '../services/payment.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCartModalOpen = false;
  cartItems: CartItem[] = [
    { name: 'Multimètre', price: 100000, quantity: 1 },
    { name: 'Multimètre', price: 100000, quantity: 1 },
    { name: 'Multimètre', price: 5000, quantity: 1 }
  ];
  totalPrice = 0;
  errorMessage = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.updateTotal();
  }

  openCartModal() {
    this.isCartModalOpen = true;
  }

  closeCartModal() {
    this.isCartModalOpen = false;
  }

  updateTotal() {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeProduct(product: CartItem) {
    this.cartItems = this.cartItems.filter(item => item !== product);
    this.updateTotal();
  }

  initiatePayment() {
    this.errorMessage = '';
    this.paymentService.initiatePaymentForCart(this.cartItems, this.totalPrice).subscribe({
      next: (response: PaymentResponse) => {
        console.log('Payment initiation response:', response);
        if (response && response.success === 1 && response.redirect_url) {
          console.log('Redirecting to:', response.redirect_url);
          window.location.href = response.redirect_url;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'initiation du paiement. Veuillez réessayer.';
          console.error('Réponse de paiement invalide', response);
        }
      },
      error: (error: Error) => {
        this.errorMessage = 'Une erreur est survenue lors de la requête de paiement. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la requête de paiement', error);
      }
    });
  }
}

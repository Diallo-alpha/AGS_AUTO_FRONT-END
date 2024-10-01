import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../services/paytech.service';
// import { PaymentService } from './payment.service';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isCartModalOpen = false;
  cartItems: CartItem[] = [
    { name: 'Multimetre', image: 'https://placehold.co/60x60?text=Multimetre', price: 100000, quantity: 1 },
    { name: 'Multimetre', image: 'https://placehold.co/60x60?text=Multimetre', price: 100000, quantity: 1 },
    { name: 'Multimetre', image: 'https://placehold.co/60x60?text=Multimetre', price: 5000, quantity: 1 }
  ];
  totalPrice = 0;

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
    const index = this.cartItems.indexOf(product);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    this.updateTotal();
  }

  initiatePayment() {
    this.paymentService.initiatePaymentForCart(this.cartItems, this.totalPrice).subscribe(
      response => {
        if (response.success) {
          // Rediriger vers l'URL de paiement
          window.location.href = response.redirect_url;
        } else {
          console.error('Erreur lors de l\'initiation du paiement', response.errors);
          // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
        }
      },
      error => {
        console.error('Erreur lors de la requête de paiement', error);
        // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
      }
    );
  }
}
